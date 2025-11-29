import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportType, filters = {}, cacheMinutes = 60 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se existe relatório em cache válido
    const cacheKey = JSON.stringify({ reportType, filters });
    const { data: cachedReport } = await supabase
      .from('reports_cache')
      .select('*')
      .eq('report_type', reportType)
      .gte('expires_at', new Date().toISOString())
      .limit(1)
      .single();

    if (cachedReport) {
      console.log('Returning cached report');
      return new Response(
        JSON.stringify({ data: cachedReport.data, cached: true, generated_at: cachedReport.generated_at }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar novo relatório baseado no tipo
    let reportData: any = {};

    switch (reportType) {
      case 'attendance_summary': {
        // Resumo de atendimentos
        const { data: conversations } = await supabase
          .from('conversations')
          .select('*')
          .gte('started_at', filters.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .lte('started_at', filters.endDate || new Date().toISOString());

        const total = conversations?.length || 0;
        const finished = conversations?.filter(c => c.status === 'finished').length || 0;
        const active = conversations?.filter(c => c.status === 'active').length || 0;
        const waiting = conversations?.filter(c => c.status === 'waiting').length || 0;

        reportData = {
          total,
          finished,
          active,
          waiting,
          finishRate: total > 0 ? (finished / total * 100).toFixed(1) : 0,
        };
        break;
      }

      case 'agent_performance': {
        // Performance dos agentes
        const { data: conversations } = await supabase
          .from('conversations')
          .select(`
            *,
            agent:agent_profiles(id, display_name)
          `)
          .not('assigned_agent_id', 'is', null)
          .gte('started_at', filters.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const agentStats: any = {};
        conversations?.forEach((conv: any) => {
          const agentId = conv.assigned_agent_id;
          if (!agentStats[agentId]) {
            agentStats[agentId] = {
              agent_name: conv.agent?.display_name || 'Unknown',
              total: 0,
              finished: 0,
              active: 0,
            };
          }
          agentStats[agentId].total++;
          if (conv.status === 'finished') agentStats[agentId].finished++;
          if (conv.status === 'active') agentStats[agentId].active++;
        });

        reportData = {
          agents: Object.values(agentStats),
          totalConversations: conversations?.length || 0,
        };
        break;
      }

      case 'channel_distribution': {
        // Distribuição por canal
        const { data: conversations } = await supabase
          .from('conversations')
          .select(`
            channel:channels(type, name)
          `)
          .gte('started_at', filters.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const channelStats: any = {};
        conversations?.forEach((conv: any) => {
          const channel = conv.channel?.type || 'unknown';
          channelStats[channel] = (channelStats[channel] || 0) + 1;
        });

        reportData = {
          channels: Object.entries(channelStats).map(([channel, count]) => ({
            channel,
            count,
          })),
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid report type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Salvar em cache
    const expiresAt = new Date(Date.now() + cacheMinutes * 60 * 1000);
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const { data: userData } = await supabase.auth.getUser(token || '');
    
    await supabase
      .from('reports_cache')
      .insert({
        report_type: reportType,
        filters,
        data: reportData,
        expires_at: expiresAt.toISOString(),
        generated_by: userData?.user?.id,
      });

    console.log('Generated new report:', reportType);
    return new Response(
      JSON.stringify({ data: reportData, cached: false, generated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
