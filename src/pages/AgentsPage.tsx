
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons'; // Assuming Icons.logo is Zapify's logo
import {
  Search,
  PlusCircle,
  PauseCircle,
  Users,
  ListFilter,
  ChevronsUpDown,
  CheckCircle,
  ArrowRightCircle,
  Download,
  UserCircle, // For user icon placeholder if needed, though MainLayout has it
  Settings,
  HelpCircleIcon,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

const AgentsPage = () => {
  // Placeholder data
  const version = "v0.1.0-beta";
  const clientsInQueue = 5;
  const agentName = "Nome do Agente"; // Placeholder

  const atendimentoAtual = {
    cliente: "João Silva",
    fila: "Suporte Técnico N1",
    protocolo: "20250520-00123",
    atribuicao: "Agente XPTO",
    prioridade: "Alta",
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-0">
      {/* Page-specific Header Bar */}
      <header className="flex items-center justify-between p-3 border-b bg-card text-card-foreground sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-7 w-7 text-primary" />
          <span className="font-semibold text-md text-primary">ZAPIFY</span>
          <span className="text-xs text-muted-foreground">{version}</span>
          <span className="ml-2 font-medium">Painel do Agente</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo atendimento
          </Button>
          <div className="text-sm font-medium">
            Clientes na fila: <span className="font-bold text-primary">{clientsInQueue}</span>
          </div>
          <Button variant="outline" size="sm">
            <PauseCircle className="mr-2 h-4 w-4" />
            Solicitar pausa
          </Button>
        </div>
        {/* The user icon and menu from MainLayout will be on the main page header, above this one.
            If a specific one was needed here, it would be:
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">Minha Conta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{agentName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações da Conta</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        */}
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Atendimento Queue */}
        <aside className="w-1/3 lg:w-1/4 border-r bg-card flex flex-col p-0">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, telefone, texto..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex items-center justify-between mt-3 gap-1">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 min-w-0">
                    Status <ChevronsUpDown className="ml-auto h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Status</DropdownMenuItem>
                  <DropdownMenuItem>Mais Recente</DropdownMenuItem>
                  <DropdownMenuItem>Prioridade</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Placeholder for queue items */}
            {[1, 2, 3, 4, 5].map((item) => (
              <Card key={item} className="hover:bg-muted/50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">Cliente {item}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Novo</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Assunto do atendimento aqui...</p>
                  <p className="text-xs text-muted-foreground mt-1">Fila: Suporte | P: Alta</p>
                </CardContent>
              </Card>
            ))}
            <p className="text-center text-xs text-muted-foreground py-4">Fim da lista.</p>
          </div>
        </aside>

        {/* Center Panel: Atendimento Details */}
        <main className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Atendimento</CardTitle>
              <CardDescription>Informações sobre o cliente e o ticket atual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Cliente:</span>
                <p className="font-semibold">{atendimentoAtual.cliente}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fila de Atendimento:</span>
                <p>{atendimentoAtual.fila}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Protocolo:</span>
                <p className="text-sm">{atendimentoAtual.protocolo}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Atribuição:</span>
                <p className="text-sm">{atendimentoAtual.atribuicao}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Prioridade:</span>
                <p className="text-sm font-semibold text-destructive">{atendimentoAtual.prioridade}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ações do Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="default">
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar
              </Button>
              <Button variant="secondary">
                <ArrowRightCircle className="mr-2 h-4 w-4" />
                Transferir
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Atendimento
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Histórico da Conversa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">O histórico da conversa com o cliente aparecerá aqui.</p>
              {/* Placeholder for chat messages */}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AgentsPage;

