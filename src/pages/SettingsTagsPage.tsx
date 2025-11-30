import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tags, Plus, Pencil, Trash2, Eye, EyeOff, Search, Loader2 } from 'lucide-react';
import { useTagsSettings } from '@/hooks/useTagsSettings';

const SettingsTagsPage = () => {
  const { tags, isLoading, createTag, deleteTag, toggleTagStatus } = useTagsSettings();
  
  const [newTag, setNewTag] = useState({ name: '', description: '', color: '#3b82f6' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveTag = async () => {
    if (!newTag.name.trim()) return;

    try {
      await createTag({
        name: newTag.name,
        description: newTag.description,
        color: newTag.color,
      });
      setNewTag({ name: '', description: '', color: '#3b82f6' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleTagStatus(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getColorClass = (color: string) => {
    // Convert hex to badge class
    return 'text-foreground';
  };

  // Filtrar etiquetas
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tag.description && tag.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tags className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Etiquetas</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie etiquetas para categorizar atendimentos.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="w-5 h-5" />
            Gerenciar Etiquetas
          </CardTitle>
          <CardDescription>
            Crie e organize etiquetas para categorizar atendimentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para nova etiqueta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="tagName">Nome da Etiqueta</Label>
              <Input
                id="tagName"
                placeholder="Ex: Urgente, VIP..."
                value={newTag.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="tagDescription">Descrição</Label>
              <Input
                id="tagDescription"
                placeholder="Descrição da etiqueta"
                value={newTag.description}
                onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="tagColor">Cor</Label>
              <Input
                id="tagColor"
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveTag} className="w-full" disabled={!newTag.name.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Busca */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar etiquetas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Lista de etiquetas */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhuma etiqueta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-sm text-muted-foreground">{tag.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(tag.id)}
                        >
                          {tag.is_active ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTagsPage;
