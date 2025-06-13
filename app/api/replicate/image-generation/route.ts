import Replicate from "replicate";
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const GENERAL_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later.';

// Interface para o modelo FLUX Schnell
interface FluxSchnellInput {
  prompt: string;
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:2' | '2:3' | '3:4';
  num_outputs?: number;
  num_inference_steps?: number;
  seed?: number;
  output_format?: 'webp' | 'jpg' | 'png';
  output_quality?: number;
  disable_safety_checker?: boolean;
  go_fast?: boolean;
  megapixels?: '0.25' | '0.5' | '1' | '2';
}

interface ReplicatePredictionOutput {
  [key: string]: any; 
}

// Função para mapear aspect ratio para o formato do FLUX
function mapAspectRatio(aspectRatio: string): '1:1' | '16:9' | '9:16' | '4:3' | '3:2' | '2:3' | '3:4' {
  const validRatios = ['1:1', '16:9', '9:16', '4:3', '3:2', '2:3', '3:4'] as const;
  return validRatios.includes(aspectRatio as any) ? aspectRatio as any : '1:1';
}

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN not configured." },
      { status: 500 }
    );
  }

  try {
    const reqBody = await request.json();
    const { prompt, aspectRatio, numberOfImages } = reqBody;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // Parâmetros para black-forest-labs/flux-schnell
    const input: FluxSchnellInput = {
      prompt: prompt,
      aspect_ratio: mapAspectRatio(aspectRatio || "1:1"),
      num_outputs: 1, // Sempre gerar apenas 1 imagem
      num_inference_steps: 4, // Recomendado pela documentação
      output_format: 'png', // PNG por padrão
      output_quality: 90, // Qualidade alta para PNG
      disable_safety_checker: false, // Manter segurança ativa
      go_fast: false, // Desativar go_fast para melhor qualidade
      megapixels: '1', // 1 megapixel para boa qualidade
    };

    // Log dos parâmetros finais para debug
    console.log("Final input parameters:", JSON.stringify(input, null, 2));

    const modelIdentifier = "black-forest-labs/flux-schnell";

    console.log(`Running Replicate model ${modelIdentifier} with input:`, JSON.stringify(input, null, 2));

    // Implementar retry logic para lidar com erros temporários do servidor
    let output;
    let attempts = 0;
    const maxAttempts = 3;
    let completedPrediction: any = null; // Declarar fora do loop para acessibilidade
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} for Replicate API call`);
        
        // Use the prediction API instead of run() for better control
        const prediction = await replicate.predictions.create({
          model: modelIdentifier,
          input: input,
        });

        console.log("Created prediction:", prediction.id);
        
        // Wait for completion with polling
        completedPrediction = prediction;
        let pollAttempts = 0;
        const maxPollAttempts = 30; // 5 minutes max (10 seconds * 30)
        
        while (completedPrediction.status !== 'succeeded' && completedPrediction.status !== 'failed' && pollAttempts < maxPollAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          completedPrediction = await replicate.predictions.get(prediction.id);
          pollAttempts++;
          console.log(`Poll attempt ${pollAttempts}: Status = ${completedPrediction.status}`);
        }
        
        if (completedPrediction.status === 'succeeded') {
          output = completedPrediction.output;
          console.log("Prediction completed successfully:", output);
          break;
        } else if (completedPrediction.status === 'failed') {
          throw new Error(`Prediction failed: ${completedPrediction.error || 'Unknown error'}`);
        } else {
          throw new Error(`Prediction timed out after ${maxPollAttempts} attempts`);
        }
        
      } catch (retryError: any) {
        console.error(`Attempt ${attempts} failed:`, retryError.message);
        
        if (attempts === maxAttempts) {
          // Última tentativa falhou, relançar o erro
          throw retryError;
        }
        
        // Esperar um pouco antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      }
    }

    let imageUrls: string[] = [];

    console.log("Final output type:", typeof output);
    console.log("Final output:", output);
    
    // FLUX Schnell retorna um array de URLs
    if (Array.isArray(output)) {
      imageUrls = output.filter(url => typeof url === 'string' && url.startsWith('http'));
    } else if (typeof output === 'string' && output.startsWith('http')) {
      imageUrls = [output];
    }

    if (imageUrls.length === 0) {
      console.log("No valid image URLs found in completed prediction. Output:", JSON.stringify(output, null, 2));
      return NextResponse.json(
        { error: "Failed to generate image. No valid URLs received from the completed prediction." },
        { status: 500 }
      );
    }

    console.log("Successfully extracted image URLs:", imageUrls);

    // Processar todas as imagens geradas
    const processedImageUrls: string[] = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        // 1. Download the image from Replicate URL
        const imageResponse = await fetch(imageUrls[i]);
        if (!imageResponse.ok) {
          console.error(`Failed to download image ${i + 1} from Replicate: ${imageResponse.statusText}`);
          continue; // Pular esta imagem e continuar com as outras
        }
        
        const imageBlob = await imageResponse.blob();
        const imageContentType = imageResponse.headers.get('content-type') || 'image/png';
        const fileExtension = imageContentType.split('/')[1] || 'png';

        // 2. Upload the image to Supabase Storage
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storagePath = `public/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generated_images')
          .upload(storagePath, imageBlob, {
            contentType: imageContentType,
            upsert: false,
          });

        if (uploadError) {
          console.error(`Supabase Storage upload error for image ${i + 1}:`, uploadError);
          continue; // Pular esta imagem e continuar com as outras
        }

        if (!uploadData || !uploadData.path) {
          console.error(`Supabase Storage upload failed to return a valid path for image ${i + 1}.`);
          continue;
        }
        
        console.log(`Supabase upload data for image ${i + 1}:`, uploadData);

        // 3. Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('generated_images')
          .getPublicUrl(uploadData.path);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error(`Could not get public URL for Supabase image ${i + 1}.`);
          continue;
        }
        
        const imageUrlInSupabase = publicUrlData.publicUrl;
        console.log(`Image ${i + 1} successfully uploaded to Supabase Storage:`, imageUrlInSupabase);

        // 4. Save metadata to Supabase table
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days

        const { error: metadataError } = await supabase
          .from('generated_images_metadata')
          .insert({
            prompt: prompt,
            replicate_prediction_id: `${completedPrediction.id}_${i}`, // Usando completedPrediction em vez de prediction
            storage_path: uploadData.path,
            image_url: imageUrlInSupabase,
            expires_at: expiresAt.toISOString(),
          });

        if (metadataError) {
          console.error(`Supabase metadata insert error for image ${i + 1}:`, metadataError);
          // Log this error, but don't fail the request
          console.warn(`Image ${i + 1} uploaded, but metadata saving failed. Manual cleanup might be needed for:`, uploadData.path);
        } else {
          console.log(`Image ${i + 1} metadata saved to Supabase.`);
        }

        processedImageUrls.push(imageUrlInSupabase);
        
      } catch (imageError: any) {
        console.error(`Error processing image ${i + 1}:`, imageError);
        // Continue with other images
      }
    }

    if (processedImageUrls.length === 0) {
      return NextResponse.json(
        { error: "Failed to process any images successfully." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      imageUrls: processedImageUrls, 
      replicateOutput: output,
      totalGenerated: processedImageUrls.length,
      totalRequested: numberOfImages || 1
    });

  } catch (error: any) {
    console.error('Full error in POST /api/replicate/image-generation:', error);
    let errorMessage = GENERAL_ERROR_MESSAGE;
    let statusCode = 500;

    if (error.message) {
      if (error.message.includes('Payment Required') || (error.response && error.response.status === 402)) {
        errorMessage = 'Replicate API call failed: Payment Required. Please check your Replicate account billing.';
        statusCode = 402;
      } else if (error.message.includes('invalid api key') || (error.response && error.response.status === 401)) {
          errorMessage = 'Replicate API call failed: Invalid API Key. Please check your REPLICATE_API_TOKEN.';
          statusCode = 401;
      } else if (error.message.includes("version does not exist") || (error.response && error.response.status === 422)){
        errorMessage = `Replicate model/version not found. Please check the model identifier. Details: ${error.message}`;
        statusCode = 422;
      } else {
        errorMessage = error.message; // Use the specific error message if available
      }
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
} 