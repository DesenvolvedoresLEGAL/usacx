
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableHead, TableHeader, TableRow, TableBody, TableCell, TableCaption,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, UserCog, Search, ChevronDown, Filter, RefreshCw, Download, MoreVertical, UserPlus } from "lucide-react";

// Dados mockados para exemplo
const AGENTS = [
  { id: 1, nome: "Amanda Souza", email: "amanda@empresa.com", status: "Ativo", tipo: "Administrador", atendimentos: 124 },
  { id: 2, nome: "Bruno Lima", email: "bruno@empresa.com", status: "Inativo", tipo: "Agente", atendimentos: 58 },
  { id: 3, nome: "Carla Silva", email: "carla@empresa.com", status: "Ativo", tipo: "Supervisor", atendimentos: 200 },
  { id: 4, nome: "Diego Santos", email: "diego@empresa.com", status: "Ativo", tipo: "Agente", atendimentos: 80 },
  { id: 5, nome: "Elisa Prado", email: "elisa@empresa.com", status: "Ativo", tipo: "Administrador", atendimentos: 137 },
];

const statusOptions = ["Todos", "Ativo", "Inativo"];
const tipoOptions = ["Todos", "Administrador", "Supervisor", "Agente"];

const AgentsManagementPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");

  // Filtro local mock
  const agentesFiltrados = AGENTS.filter((a) =>
    (status === "Todos" || a.status === status) &&
    (tipo === "Todos" || a.tipo === tipo) &&
    (a.nome.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão - Agentes</h1>
          <p className="text-muted-foreground mt-1 text-sm">Administre todos os agentes, permissões e dados de acesso.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Agente
          </Button>
        </div>
      </header>

      {/* FILTROS */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-3 items-stretch pt-6 pb-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-44 justify-between">
                <Filter className="w-4 h-4 mr-2" />
                Status: <span className="ml-1">{status}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map(opt => (
                <DropdownMenuItem key={opt} onClick={() => setStatus(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-44 justify-between">
                <UserCog className="w-4 h-4 mr-2" />
                Tipo: <span className="ml-1">{tipo}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {tipoOptions.map(opt => (
                <DropdownMenuItem key={opt} onClick={() => setTipo(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* TABELA DE AGENTES */}
      <Card className="flex-1 overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-base">Lista de Agentes</CardTitle>
          <CardDescription>Veja, filtre e gerencie os agentes cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Atendimentos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum agente encontrado.
                  </TableCell>
                </TableRow>
              ) : agentesFiltrados.map((agente) => (
                <TableRow key={agente.id}>
                  <TableCell className="font-medium">{agente.nome}</TableCell>
                  <TableCell>{agente.email}</TableCell>
                  <TableCell>
                    <span className={agente.status === "Ativo" ? "text-green-600" : "text-muted-foreground"}>
                      {agente.status}
                    </span>
                  </TableCell>
                  <TableCell>{agente.tipo}</TableCell>
                  <TableCell className="text-right">{agente.atendimentos}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-transparent">
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Mais ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserCog className="mr-2 w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 w-4 h-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 w-4 h-4" />
                          Exportar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-xs text-muted-foreground">Total de agentes: {agentesFiltrados.length}</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentsManagementPage;
