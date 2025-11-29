import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationContext, clientMessage, agentNotes } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Construir contexto para a IA
    const systemPrompt = `Você é um assistente especializado em sugerir respostas para agentes de atendimento ao cliente.
    
Seu objetivo é fornecer 3 sugestões de resposta diferentes, variando em tom e abordagem:
1. Uma resposta profissional e formal
2. Uma resposta amigável e casual
3. Uma resposta empática e detalhada

Considere:
- O histórico da conversa
- O contexto do cliente
- A mensagem atual
- Notas do agente sobre o cliente

Forneça respostas prontas para uso, sem explicações adicionais.`;

    const userPrompt = `Contexto da conversa:
${conversationContext}

Última mensagem do cliente:
"${clientMessage}"

${agentNotes ? `Notas sobre o cliente:\n${agentNotes}` : ''}

Sugira 3 respostas adequadas para o agente enviar.`;

    console.log('Requesting AI suggestions...');

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
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
    const content = aiResponse.choices[0]?.message?.content || '';
    
    // Extrair as 3 sugestões do conteúdo
    const suggestions = content
      .split(/\d+\.\s+/)
      .filter((s: string) => s.trim())
      .slice(0, 3)
      .map((s: string) => s.trim());

    console.log('Generated suggestions:', suggestions.length);

    return new Response(
      JSON.stringify({ 
        suggestions: suggestions.length > 0 ? suggestions : [content],
        model: 'google/gemini-2.5-flash'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-suggest-response:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
