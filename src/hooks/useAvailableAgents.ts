import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailableAgent {
  id: string;
  displayName: string;
  status: string;
  activeConversations: number;
}

export const useAvailableAgents = () => {
  const [agents, setAgents] = useState<AvailableAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select(`
          id,
          display_name,
          status,
          conversations:conversations!assigned_agent_id(count)
        `)
        .in('status', ['online', 'away'])
        .order('display_name');

      if (error) throw error;

      const formattedAgents: AvailableAgent[] = (data || []).map((agent: any) => ({
        id: agent.id,
        displayName: agent.display_name || 'Sem nome',
        status: agent.status,
        activeConversations: agent.conversations?.[0]?.count || 0,
      }));

      setAgents(formattedAgents);
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();

    // Refresh every 15 seconds
    const interval = setInterval(() => {
      fetchAgents();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return { agents, loading, refresh: fetchAgents };
};
