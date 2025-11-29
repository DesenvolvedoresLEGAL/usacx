import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: Simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simple IP-based rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { conversationId, detailLevel = 'medium' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar dados da conversa
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        client:clients(*),
        messages(*)
      `)
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      throw new Error('Conversation not found');
    }

    // Construir histórico de mensagens
    const messageHistory = conversation.messages
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((m: any) => `${m.sender_type === 'client' ? 'Cliente' : 'Agente'}: ${m.content}`)
      .join('\n');

    // Definir prompt baseado no nível de detalhe
    let systemPrompt = '';
    switch (detailLevel) {
      case 'brief':
        systemPrompt = `Resuma esta conversa de atendimento em 2-3 frases curtas, destacando apenas o problema principal e a solução.`;
        break;
      case 'detailed':
        systemPrompt = `Forneça um resumo detalhado desta conversa de atendimento, incluindo:
- Problema ou solicitação do cliente
- Etapas de resolução tomadas
- Status final (resolvido/pendente)
- Próximos passos (se houver)
- Sentimento geral do cliente`;
        break;
      default: // medium
        systemPrompt = `Resuma esta conversa de atendimento em um parágrafo, destacando o problema do cliente e como foi tratado.`;
    }

    const userPrompt = `Cliente: ${conversation.client.name}
Status: ${conversation.status}
Início: ${new Date(conversation.started_at).toLocaleString('pt-BR')}

Histórico de mensagens:
${messageHistory}

Forneça o resumo em português.`;

    console.log('Requesting conversation summary...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const summary = aiResponse.choices[0]?.message?.content || '';

    console.log('Generated summary for conversation:', conversationId);

    // Opcional: Salvar resumo no metadata da conversa
    await supabase
      .from('conversations')
      .update({
        metadata: {
          ...(conversation.metadata || {}),
          ai_summary: summary,
          summary_generated_at: new Date().toISOString(),
        }
      })
      .eq('id', conversationId);

    return new Response(
      JSON.stringify({ 
        summary,
        conversationId,
        detailLevel,
        client: conversation.client.name,
        status: conversation.status,
        messageCount: conversation.messages.length,
        model: 'google/gemini-2.5-flash'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-summarize-conversation:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});