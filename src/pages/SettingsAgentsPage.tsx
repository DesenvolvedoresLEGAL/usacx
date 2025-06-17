
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";

interface AgentConfig {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  cargo: string;
  status: "ativo" | "inativo" | "suspenso";
  maxAtendimentosSimultaneos: number;
  tempoMaximoAtendimento: number;
  pausasPermitidas: string[];
  horarioTrabalho: {
    segunda: { inicio: string; fim: string; ativo: boolean };
    terca: { inicio: string; fim: string; ativo: boolean };
    quarta: { inicio: string; fim: string; ativo: boolean };
    quinta: { inicio: string; fim: string; ativo: boolean };
    sexta: { inicio: string; fim: string; ativo: boolean };
    sabado: { inicio: string; fim: string; ativo: boolean };
    domingo: { inicio: string; fim: string; ativo: boolean };
  };
  permissoes: {
    visualizarTodosAtendimentos: boolean;
    transferirAtendimentos: boolean;
    acessarRelatorios: boolean;
    gerenciarFilas: boolean;
    configurarMensagensProntas: boolean;
    supervisionarAgentes: boolean;
  };
  configuracoes: {
    notificacaoSom: boolean;
    notificacaoDesktop: boolean;
    aceitarAtendimentosAutomatico: boolean;
    mostrarPreview: boolean;
    temaEscuro: boolean;
  };
  metas: {
    atendimentosPorDia: number;
    tempoMedioResposta: number;
    satisfacaoMinima: number;
  };
}

const mockAgents: AgentConfig[] = [
  {
    id: "1",
    nome: "Amanda Souza",
    email: "amanda@empresa.com",
    departamento: "Suporte",
    cargo: "Agente Senior",
    status: "ativo",
    maxAtendimentosSimultaneos: 3,
    tempoMaximoAtendimento: 30,
    pausasPermitidas: ["almoco", "cafe", "banheiro"],
    horarioTrabalho: {
      segunda: { inicio: "08:00", fim: "17:00", ativo: true },
      terca: { inicio: "08:00", fim: "17:00", ativo: true },
      quarta: { inicio: "08:00", fim: "17:00", ativo: true },
      quinta: { inicio: "08:00", fim: "17:00", ativo: true },
      sexta: { inicio: "08:00", fim: "17:00", ativo: true },
      sabado: { inicio: "00:00", fim: "00:00", ativo: false },
      domingo: { inicio: "00:00", fim: "00:00", ativo: false },
    },
    permissoes: {
      visualizarTodosAtendimentos: false,
      transferirAtendimentos: true,
      acessarRelatorios: false,
      gerenciarFilas: false,
      configurarMensagensProntas: true,
      supervisionarAgentes: false,
    },
    configuracoes: {
      notificacaoSom: true,
      notificacaoDesktop: true,
      aceitarAtendimentosAutomatico: false,
      mostrarPreview: true,
      temaEscuro: false,
    },
    metas: {
      atendimentosPorDia: 25,
      tempoMedioResposta: 2,
      satisfacaoMinima: 4.5,
    },
  },
  {
    id: "2",
    nome: "Bruno Lima",
    email: "bruno@empresa.com",
    departamento: "Vendas",
    cargo: "Agente Junior",
    status: "ativo",
    maxAtendimentosSimultaneos: 2,
    tempoMaximoAtendimento: 45,
    pausasPermitidas: ["almoco", "cafe"],
    horarioTrabalho: {
      segunda: { inicio: "09:00", fim: "18:00", ativo: true },
      terca: { inicio: "09:00", fim: "18:00", ativo: true },
      quarta: { inicio: "09:00", fim: "18:00", ativo: true },
      quinta: { inicio: "09:00", fim: "18:00", ativo: true },
      sexta: { inicio: "09:00", fim: "18:00", ativo: true },
      sabado: { inicio: "00:00", fim: "00:00", ativo: false },
      domingo: { inicio: "00:00", fim: "00:00", ativo: false },
    },
    permissoes: {
      visualizarTodosAtendimentos: false,
      transferirAtendimentos: false,
      acessarRelatorios: false,
      gerenciarFilas: false,
      configurarMensagensProntas: false,
      supervisionarAgentes: false,
    },
    configuracoes: {
      notificacaoSom: true,
      notificacaoDesktop: false,
      aceitarAtendimentosAutomatico: true,
      mostrarPreview: false,
      temaEscuro: true,
    },
    metas: {
      atendimentosPorDia: 15,
      tempoMedioResposta: 3,
      satisfacaoMinima: 4.0,
    },
  },
];

const departamentos = ["Suporte", "Vendas", "Financeiro", "RH", "TI"];
const cargos = ["Agente Junior", "Agente Pleno", "Agente Senior", "Supervisor", "Gerente"];
const pausasDisponiveis = [
  { id: "almoco", nome: "Almoço" },
  { id: "cafe", nome: "Café" },
  { id: "banheiro", nome: "Banheiro" },
  { id: "treinamento", nome: "Treinamento" },
  { id: "reuniao", nome: "Reunião" },
];

const SettingsAgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [agents] = useState<AgentConfig[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === "" || 
      agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartamento = selectedDepartamento === "all" || agent.departamento === selectedDepartamento;
    const matchesStatus = selectedStatus === "all" || agent.status === selectedStatus;

    return matchesSearch && matchesDepartamento && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ativo":
        return "default";
      case "inativo":
        return "secondary";
      case "suspenso":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleEditAgent = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handleSaveAgent = () => {
    console.log("Salvando configurações do agente:", selectedAgent);
    setIsDialogOpen(false);
    setSelectedAgent(null);
  };

  const updateAgentField = (field: string, value: any) => {
    if (selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        [field]: value,
      });
    }
  };

  const updatePermission = (permission: string, value: boolean) => {
    if (selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        permissoes: {
          ...selectedAgent.permissoes,
          [permission]: value,
        },
      });
    }
  };

  const updateConfiguracao = (config: string, value: boolean) => {
    if (selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        configuracoes: {
          ...selectedAgent.configuracoes,
          [config]: value,
        },
      });
    }
  };

  const updateHorario = (dia: string, field: string, value: string | boolean) => {
    if (selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        horarioTrabalho: {
          ...selectedAgent.horarioTrabalho,
          [dia]: {
            ...selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho],
            [field]: value,
          },
        },
      });
    }
  };

  const updateMeta = (meta: string, value: number) => {
    if (selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        metas: {
          ...selectedAgent.metas,
          [meta]: value,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações - Agentes</h1>
          <p className="text-muted-foreground">
            Configure permissões, horários e comportamentos dos agentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Exportar Configurações
          </Button>
          <Button>
            <Icons.plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              Agentes configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
            <Icons.userCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agents.filter(a => a.status === "ativo").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Online e disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <Icons.building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departamentos.length}</div>
            <p className="text-xs text-muted-foreground">
              Departamentos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Metas</CardTitle>
            <Icons.target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(agents.reduce((sum, agent) => sum + agent.metas.atendimentosPorDia, 0) / agents.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Atendimentos por dia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os agentes por nome, departamento ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departamentos.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Agentes */}
      <Card>
        <CardHeader>
          <CardTitle>Agentes Configurados</CardTitle>
          <CardDescription>
            {filteredAgents.length} agente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Max. Atendimentos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.nome}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.departamento}</TableCell>
                    <TableCell>{agent.cargo}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(agent.status)}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.maxAtendimentosSimultaneos}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAgent(agent)}
                      >
                        <Icons.settings className="mr-2 h-4 w-4" />
                        Configurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <Icons.users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhum agente encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Configuração */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações do Agente</DialogTitle>
            <DialogDescription>
              Configure as permissões, horários e comportamentos do agente
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <Tabs defaultValue="geral" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                <TabsTrigger value="horarios">Horários</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
                <TabsTrigger value="metas">Metas</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={selectedAgent.nome}
                      onChange={(e) => updateAgentField("nome", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedAgent.email}
                      onChange={(e) => updateAgentField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Select 
                      value={selectedAgent.departamento} 
                      onValueChange={(value) => updateAgentField("departamento", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select 
                      value={selectedAgent.cargo} 
                      onValueChange={(value) => updateAgentField("cargo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAtendimentos">Máx. Atendimentos Simultâneos</Label>
                    <Input
                      id="maxAtendimentos"
                      type="number"
                      min="1"
                      max="10"
                      value={selectedAgent.maxAtendimentosSimultaneos}
                      onChange={(e) => updateAgentField("maxAtendimentosSimultaneos", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoMax">Tempo Máx. Atendimento (min)</Label>
                    <Input
                      id="tempoMax"
                      type="number"
                      min="5"
                      max="120"
                      value={selectedAgent.tempoMaximoAtendimento}
                      onChange={(e) => updateAgentField("tempoMaximoAtendimento", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pausas Permitidas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {pausasDisponiveis.map((pausa) => (
                      <div key={pausa.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={pausa.id}
                          checked={selectedAgent.pausasPermitidas.includes(pausa.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateAgentField("pausasPermitidas", [...selectedAgent.pausasPermitidas, pausa.id]);
                            } else {
                              updateAgentField("pausasPermitidas", selectedAgent.pausasPermitidas.filter(p => p !== pausa.id));
                            }
                          }}
                        />
                        <Label htmlFor={pausa.id}>{pausa.nome}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissoes" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries({
                    visualizarTodosAtendimentos: "Visualizar todos os atendimentos",
                    transferirAtendimentos: "Transferir atendimentos",
                    acessarRelatorios: "Acessar relatórios",
                    gerenciarFilas: "Gerenciar filas",
                    configurarMensagensProntas: "Configurar mensagens prontas",
                    supervisionarAgentes: "Supervisionar outros agentes",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key}>{label}</Label>
                      <Switch
                        id={key}
                        checked={selectedAgent.permissoes[key as keyof typeof selectedAgent.permissoes]}
                        onCheckedChange={(checked) => updatePermission(key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="horarios" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries({
                    segunda: "Segunda-feira",
                    terca: "Terça-feira",
                    quarta: "Quarta-feira",
                    quinta: "Quinta-feira",
                    sexta: "Sexta-feira",
                    sabado: "Sábado",
                    domingo: "Domingo",
                  }).map(([dia, label]) => (
                    <div key={dia} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-24">
                        <Label>{label}</Label>
                      </div>
                      <Switch
                        checked={selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho].ativo}
                        onCheckedChange={(checked) => updateHorario(dia, "ativo", checked)}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho].inicio}
                          onChange={(e) => updateHorario(dia, "inicio", e.target.value)}
                          disabled={!selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho].ativo}
                        />
                        <span className="self-center">até</span>
                        <Input
                          type="time"
                          value={selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho].fim}
                          onChange={(e) => updateHorario(dia, "fim", e.target.value)}
                          disabled={!selectedAgent.horarioTrabalho[dia as keyof typeof selectedAgent.horarioTrabalho].ativo}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="configuracoes" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries({
                    notificacaoSom: "Notificações por som",
                    notificacaoDesktop: "Notificações no desktop",
                    aceitarAtendimentosAutomatico: "Aceitar atendimentos automaticamente",
                    mostrarPreview: "Mostrar preview das mensagens",
                    temaEscuro: "Tema escuro",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key}>{label}</Label>
                      <Switch
                        id={key}
                        checked={selectedAgent.configuracoes[key as keyof typeof selectedAgent.configuracoes]}
                        onCheckedChange={(checked) => updateConfiguracao(key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metas" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaAtendimentos">Atendimentos por Dia</Label>
                    <Input
                      id="metaAtendimentos"
                      type="number"
                      min="1"
                      value={selectedAgent.metas.atendimentosPorDia}
                      onChange={(e) => updateMeta("atendimentosPorDia", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoResposta">Tempo Médio de Resposta (min)</Label>
                    <Input
                      id="tempoResposta"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={selectedAgent.metas.tempoMedioResposta}
                      onChange={(e) => updateMeta("tempoMedioResposta", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="satisfacao">Satisfação Mínima (1-5)</Label>
                    <Input
                      id="satisfacao"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={selectedAgent.metas.satisfacaoMinima}
                      onChange={(e) => updateMeta("satisfacaoMinima", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgent}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsAgentsPage;
