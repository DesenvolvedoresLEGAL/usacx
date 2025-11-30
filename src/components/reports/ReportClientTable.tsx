
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Mail } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const segmentColors = {
  "VIP": "bg-purple-100 text-purple-800",
  "Premium": "bg-blue-100 text-blue-800",
  "Regular": "bg-gray-100 text-gray-800",
  "Novo": "bg-green-100 text-green-800",
};

const statusColors = {
  "active": "bg-green-100 text-green-800",
  "inactive": "bg-yellow-100 text-yellow-700",
  "blocked": "bg-red-100 text-red-800",
};

const channelIcons = {
  "WhatsApp": MessageSquare,
  "Email": Mail,
  "Chat Web": MessageSquare,
  "Telefone": MessageSquare,
};

export function ReportClientTable({ filters }: { filters: any }) {
  const data: any[] = [];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Contato</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : data.map((client) => {
              const ChannelIcon = channelIcons[client.preferredChannel as keyof typeof channelIcons];
              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {client.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.email}</div>
                      <div className="text-muted-foreground">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={segmentColors[client.segment as keyof typeof segmentColors]}>
                      {client.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[client.status as keyof typeof statusColors]}>
                      {client.status === "active" ? "Ativo" : client.status === "inactive" ? "Inativo" : "Bloqueado"}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.lastContact}</TableCell>
                  <TableCell>{client.totalTickets}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{client.avgRating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChannelIcon className="w-4 h-4" />
                      <span className="text-sm">{client.preferredChannel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
