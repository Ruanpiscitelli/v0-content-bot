import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log('Delete Expired Images function booting up!');

// CORS Headers - ajuste conforme necessÃ¡rio, especialmente para invocaÃ§Ã£o local
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ou seu frontend URL
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Crie um cliente Supabase. As variÃ¡veis de ambiente sÃ£o automaticamente
    //    disponibilizadas para Edge Functions se configuradas no dashboard do projeto.
    //    Certifique-se que SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estÃ£o definidas
    //    nas configuraÃ§Ãµes da sua funÃ§Ã£o no Supabase.
    const supabaseUrl = Deno.env.get('PROJECT_URL');
    const supabaseServiceKey = Deno.env.get('SERVICE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing PROJECT_URL or SERVICE_KEY environment variables');
      throw new Error('Missing PROJECT_URL or SERVICE_KEY environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        // NecessÃ¡rio para operaÃ§Ãµes que exigem privilÃ©gios de admin,
        // como interagir com buckets de storage com polÃ­ticas restritas.
        // No entanto, a SERVICE_ROLE_KEY jÃ¡ deve prover isso.
        // autoRefreshToken: false, // Opcional, dependendo do caso de uso
        // persistSession: false, // Opcional, dependendo do caso de uso
        // detectSessionInUrl: false, // Opcional, dependendo do caso de uso
      },
    });

    const currentTime = new Date().toISOString();

    // 2. Busque metadados de imagens expiradas
    const { data: expiredImages, error: fetchError } = await supabase
      .from('generated_images_metadata')
      .select('id, storage_path, image_url')
      .lt('expires_at', currentTime); // Less than current time

    if (fetchError) {
      console.error('Error fetching expired images metadata:', fetchError);
      throw fetchError;
    }

    if (!expiredImages || expiredImages.length === 0) {
      console.log('No expired images to delete.');
      return new Response(JSON.stringify({ message: 'No expired images to delete.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Found ${expiredImages.length} expired images to process.`);

    const deletedFilesPaths: string[] = [];
    const failedDeletions: { path: string; error: any }[] = [];
    const deletedMetadataIds: string[] = [];
    const failedMetadataDeletions: { id: string; error: any }[] = [];

    // 3. Para cada imagem expirada, delete do Storage e depois da tabela de metadados
    for (const image of expiredImages) {
      if (!image.storage_path) {
        console.warn(`Skipping image ID ${image.id} due to missing storage_path.`);
        continue;
      }

      // 3a. Delete do Supabase Storage
      // storage.remove() espera um array de paths
      const { data: deleteData, error: deleteStorageError } = await supabase.storage
        .from('generated_images') // Seu bucket
        .remove([image.storage_path]);

      if (deleteStorageError) {
        console.error(`Error deleting image ${image.storage_path} from storage:`, deleteStorageError);
        failedDeletions.push({ path: image.storage_path, error: deleteStorageError });
      } else {
        console.log(`Successfully deleted ${image.storage_path} from storage.`);
        deletedFilesPaths.push(image.storage_path);

        // 3b. Delete o registro da tabela de metadados SOMENTE SE o arquivo foi removido
        const { error: deleteMetaError } = await supabase
          .from('generated_images_metadata')
          .delete()
          .eq('id', image.id);

        if (deleteMetaError) {
          console.error(`Error deleting metadata for image ID ${image.id} (path ${image.storage_path}):`, deleteMetaError);
          failedMetadataDeletions.push({ id: image.id, error: deleteMetaError });
        } else {
          console.log(`Successfully deleted metadata for image ID ${image.id}.`);
          deletedMetadataIds.push(image.id);
        }
      }
    }

    const responsePayload = {
      message: 'Expired images processing complete.',
      deletedFilesCount: deletedFilesPaths.length,
      deletedFilesPaths,
      failedStorageDeletionsCount: failedDeletions.length,
      failedDeletions,
      deletedMetadataCount: deletedMetadataIds.length,
      deletedMetadataIds,
      failedMetadataDeletionsCount: failedMetadataDeletions.length,
      failedMetadataDeletions,
    };

    console.log('Function execution summary:', responsePayload);

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Delete Expired Images function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 