import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  description: string | null;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTagsSettings = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as etiquetas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (tagData: {
    name: string;
    description?: string;
    color: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            name: tagData.name,
            description: tagData.description || null,
            color: tagData.color,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTags((prev) => [...prev, data]);
      toast({
        title: 'Etiqueta criada',
        description: 'Nova etiqueta foi adicionada com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a etiqueta.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTag = async (
    id: string,
    updates: Partial<Omit<Tag, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTags((prev) => prev.map((tag) => (tag.id === id ? data : tag)));
      toast({
        title: 'Etiqueta atualizada',
        description: 'Etiqueta foi atualizada com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a etiqueta.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase.from('tags').delete().eq('id', id);

      if (error) throw error;

      setTags((prev) => prev.filter((tag) => tag.id !== id));
      toast({
        title: 'Etiqueta removida',
        description: 'Etiqueta foi removida com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a etiqueta.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleTagStatus = async (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (!tag) return;

    await updateTag(id, { is_active: !tag.is_active });
  };

  useEffect(() => {
    fetchTags();

    // Subscribe to changes
    const channel = supabase
      .channel('tags-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags',
        },
        () => {
          fetchTags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tags,
    isLoading,
    createTag,
    updateTag,
    deleteTag,
    toggleTagStatus,
    refetch: fetchTags,
  };
};
