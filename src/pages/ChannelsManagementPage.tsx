
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreVertical, RefreshCw, Edit, Trash2, CheckCircle2, XCircle, Search, MessageSquare, Mail, Phone, ChevronDown } from "lucide-react";

// Mock dos canais conectados
const MOCK_CHANNELS = [
  {
    id: 1,
    nome: "WhatsApp Empresarial",
    tipo: "WhatsApp",
    status: "Conectado",
    details: "11988887777",
    icon: <MessageSquare className="text-green-600" />,
  },
  {
    id: 2,
    nome: "Suporte E-mail",
    tipo: "Email",
    status: "Conectado",
    details: "suporte@contato.com",
    icon: <Mail className="text-blue-600" />,
  },
  {
    id: 3,
    nome: "Telefone Fixo Sales",
    tipo: "Telefone",
    status: "Desconectado",
    details: "1133556677",
    icon: <Phone className="text-gray-400" />,
  },
];

const statusOptions = ["Todos", "Conectado", "Desconectado"];
const tipoOptions = ["Todos", "WhatsApp", "Email", "Telefone"];

const ChannelsManagementPage = () => {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  // Estado futuro para formulário: exibe modal de novo canal
  // const [showModal, setShowModal] = useState(false);

  const canaisFiltrados = MOCK_CHANNELS.filter((c) =>
    (tipo === "Todos" || c.tipo === tipo) &&
    (status === "Todos" || c.status === status) &&
    (c.nome.toLowerCase().includes(search.toLowerCase()) || c.details.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão - Canais</h1>
          <p className="text-muted-foreground mt-1 text-sm">Adicione, configure e monitore todos os canais de atendimento conectados à plataforma.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Canal
          </Button>
        </div>
      </header>

      {/* Filtros */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-3 items-stretch pt-6 pb-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou detalhe..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar canal"
            />
          </div>
          {/* Dropdown Tipo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-44 justify-between">
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
          {/* Dropdown Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-44 justify-between">
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
        </CardContent>
      </Card>

      {/* Tabela de canais */}
      <Card className="flex-1 overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-base">Canais Conectados</CardTitle>
          <CardDescription>Controle, edite e monitore os canais ativos da sua operação.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Detalhe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {canaisFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum canal encontrado.
                  </TableCell>
                </TableRow>
              ) : canaisFiltrados.map((canal) => (
                <TableRow key={canal.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    {canal.icon}
                    <span>{canal.nome}</span>
                  </TableCell>
                  <TableCell>{canal.details}</TableCell>
                  <TableCell>
                    {canal.status === "Conectado" ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> {canal.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-destructive font-semibold">
                        <XCircle className="w-4 h-4" /> {canal.status}
                      </span>
                    )}
                  </TableCell>
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
                          <Edit className="mr-2 w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 w-4 h-4" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-xs text-muted-foreground">Total de canais: {canaisFiltrados.length}</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelsManagementPage;
