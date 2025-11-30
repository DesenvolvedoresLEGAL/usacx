import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PauseReason {
  id: string;
  label: string;
  description: string | null;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePauseSettings = () => {
  const [pauseReasons, setPauseReasons] = useState<PauseReason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPauseReasons = async () => {
    try {
      const { data, error } = await supabase
        .from('pause_reasons')
        .select('*')
        .order('label');

      if (error) throw error;
      setPauseReasons(data || []);
    } catch (error) {
      console.error('Error fetching pause reasons:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os motivos de pausa.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPauseReason = async (pauseData: {
    label: string;
    description?: string;
    icon: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('pause_reasons')
        .insert([
          {
            label: pauseData.label,
            description: pauseData.description || null,
            icon: pauseData.icon,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPauseReasons((prev) => [...prev, data]);
      toast({
        title: 'Motivo de pausa criado',
        description: 'Novo motivo de pausa foi adicionado com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error creating pause reason:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o motivo de pausa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePauseReason = async (
    id: string,
    updates: Partial<Omit<PauseReason, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('pause_reasons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPauseReasons((prev) =>
        prev.map((pause) => (pause.id === id ? data : pause))
      );
      toast({
        title: 'Motivo de pausa atualizado',
        description: 'Motivo de pausa foi atualizado com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error updating pause reason:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o motivo de pausa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePauseReason = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pause_reasons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPauseReasons((prev) => prev.filter((pause) => pause.id !== id));
      toast({
        title: 'Motivo de pausa removido',
        description: 'Motivo de pausa foi removido com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting pause reason:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o motivo de pausa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const togglePauseStatus = async (id: string) => {
    const pause = pauseReasons.find((p) => p.id === id);
    if (!pause) return;

    await updatePauseReason(id, { is_active: !pause.is_active });
  };

  useEffect(() => {
    fetchPauseReasons();

    // Subscribe to changes
    const channel = supabase
      .channel('pause-reasons-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pause_reasons',
        },
        () => {
          fetchPauseReasons();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    pauseReasons,
    isLoading,
    createPauseReason,
    updatePauseReason,
    deletePauseReason,
    togglePauseStatus,
    refetch: fetchPauseReasons,
  };
};
