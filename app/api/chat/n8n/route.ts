import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server'; // Importando o server client

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || 'https://n8n-wh.datavibe.ad/webhook/contentbot';

interface ClientMessage {
  id: string;
  content: string;
  sender: "user" | "bot"; // Assuming "bot" is used for assistant messages in client
  timestamp: Date;
}

interface N8nChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestPayload {
  question: string;
  history?: ClientMessage[];
  deviceData?: any; // Adicionar deviceData aqui
}

interface N8nResponse {
  answer?: string; // Assuming n8n returns something like this
  // Or it might be a direct text response
  [key: string]: any; // To accommodate other potential fields or direct text
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user or no user found:', userError);
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email;
    let userName: string | null | undefined = user.user_metadata?.name || user.user_metadata?.full_name || null;

    // Se o nome não estiver nos metadados, tentar buscar na tabela 'profiles'
    if (!userName) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, full_name, username') // Ajuste as colunas conforme sua tabela
        .eq('id', userId)
        .single();

      if (profileError) {
        console.warn(`Could not fetch user profile for ${userId} from profiles table:`, profileError.message);
      } else if (profile) {
        userName = profile.name || profile.full_name || profile.username || null;
      }
    }
    
    const body: RequestPayload = await request.json();
    const { question, history = [], deviceData = {} } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const chat_history: N8nChatMessage[] = history
      .filter(msg => msg.id !== 'welcome') // Optionally filter out the initial welcome message
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

    // Construir o payload para o n8n no formato de array especificado
    const n8nObjectPayload: {
      message: string;
      deviceData: any;
      chat_history?: N8nChatMessage[];
      userId: string;
      userEmail?: string;
      userName?: string | null;
    } = {
      message: question,
      deviceData: deviceData, // Usar o deviceData recebido
      userId: userId,
      userEmail: userEmail,
      userName: userName,
    };

    if (chat_history.length > 0) {
      n8nObjectPayload.chat_history = chat_history;
    }

    const n8nPayloadArray = [n8nObjectPayload]; // Encapsular em um array

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayloadArray), // Enviar o array
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text().catch(() => 'Failed to get error text from n8n');
      console.error(`Error from n8n: ${n8nResponse.status} - ${errorText}`);
      // Retornar o erro do n8n para o cliente para melhor depuração no lado do cliente também
      return NextResponse.json({ error: `N8n workflow error: ${errorText}`, details: errorText }, { status: n8nResponse.status });
    }

    // Processar a resposta do n8n
    let botResponseText: string;
    const rawTextResponse = await n8nResponse.text();

    try {
      const jsonData = JSON.parse(rawTextResponse);
      // Espera-se: { "output": "TEXTO" } ou [{ "output": "TEXTO" }]
      if (typeof jsonData === 'object' && jsonData !== null) {
        if (jsonData.output && typeof jsonData.output === 'string') {
          // Caso: { "output": "TEXTO" }
          botResponseText = jsonData.output.trim();
        } else if (Array.isArray(jsonData) && jsonData.length > 0 && typeof jsonData[0] === 'object' && jsonData[0] !== null && typeof jsonData[0].output === 'string') {
          // Caso: [{ "output": "TEXTO" }]
          botResponseText = jsonData[0].output.trim();
        } else {
          // Se o JSON for válido mas não tiver a estrutura esperada, logar e usar o texto raw
          console.warn('N8n response was valid JSON but not in the expected format {output: "text"} or [{output: "text"}]. Using raw text instead.', jsonData);
          botResponseText = rawTextResponse;
        }
      } else {
        // Não é um objeto JSON, deveria ser pego pelo catch, mas por segurança:
        console.warn('N8n response was not a JSON object. Using raw text instead.', rawTextResponse);
        botResponseText = rawTextResponse;
      }
    } catch (jsonError) {
      // Se não for JSON, usar como texto plano (já está em rawTextResponse)
      console.log('N8n response was not JSON. Using as plain text.');
      botResponseText = rawTextResponse;
    }

    return NextResponse.json({ message: botResponseText });

  } catch (error) {
    console.error('Error in /api/chat/n8n:', error);
    if (error instanceof SyntaxError && error.message.includes("Unexpected end of JSON input")) {
        return NextResponse.json({ error: 'Failed to parse request body as JSON.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 