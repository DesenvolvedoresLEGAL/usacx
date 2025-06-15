
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Users, MessageSquare, Archive, Trash2, UserPlus } from "lucide-react";

interface AttendanceBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export const AttendanceBulkActions = ({ selectedCount, onClearSelection }: AttendanceBulkActionsProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedCount} selecionados
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ações em massa:</span>
              
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Alterar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Transferir para" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria">Maria Silva</SelectItem>
                  <SelectItem value="joao">João Santos</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                  <SelectItem value="queue">Voltar para fila</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Atribuir
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Enviar Mensagem
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-1" />
              Arquivar
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
