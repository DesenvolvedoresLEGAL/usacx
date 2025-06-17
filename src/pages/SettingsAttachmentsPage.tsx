
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Paperclip, Upload, Download, Trash2, Search, Filter, FileText, Image, Video, Music, Archive, Settings, Eye, ExternalLink } from "lucide-react";

export default function SettingsAttachmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const attachments = [
    { 
      id: 1, 
      name: "Manual_Usuario.pdf", 
      type: "PDF", 
      size: "2.3 MB", 
      uploadDate: "2024-01-15", 
      downloads: 45, 
      category: "Documentos",
      url: "#",
      active: true 
    },
    { 
      id: 2, 
      name: "Logo_Empresa.png", 
      type: "Imagem", 
      size: "156 KB", 
      uploadDate: "2024-01-14", 
      downloads: 23, 
      category: "Imagens",
      url: "#",
      active: true 
    },
    { 
      id: 3, 
      name: "Video_Treinamento.mp4", 
      type: "Vídeo", 
      size: "45.7 MB", 
      uploadDate: "2024-01-13", 
      downloads: 12, 
      category: "Vídeos",
      url: "#",
      active: false 
    },
    { 
      id: 4, 
      name: "Contrato_Modelo.docx", 
      type: "Documento", 
      size: "890 KB", 
      uploadDate: "2024-01-12", 
      downloads: 67, 
      category: "Documentos",
      url: "#",
      active: true 
    },
    { 
      id: 5, 
      name: "Planilha_Precos.xlsx", 
      type: "Planilha", 
      size: "1.2 MB", 
      uploadDate: "2024-01-11", 
      downloads: 89, 
      category: "Documentos",
      url: "#",
      active: true 
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "documento":
      case "planilha":
        return FileText;
      case "imagem":
        return Image;
      case "vídeo":
        return Video;
      case "áudio":
        return Music;
      default:
        return Archive;
    }
  };

  const storageUsed = 2847; // MB
  const storageLimit = 5000; // MB
  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Anexos</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie arquivos e anexos disponíveis para os agentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Backup
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Arquivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Arquivo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Arraste arquivos aqui</p>
                  <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
                  <Button variant="outline" className="mt-4">
                    Selecionar Arquivos
                  </Button>
                </div>
                <div>
                  <Label htmlFor="file-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentos">Documentos</SelectItem>
                      <SelectItem value="imagens">Imagens</SelectItem>
                      <SelectItem value="videos">Vídeos</SelectItem>
                      <SelectItem value="audios">Áudios</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="file-active" defaultChecked />
                  <Label htmlFor="file-active">Disponível para agentes</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Upload</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uso do Armazenamento</h3>
            <Badge variant="outline">
              {storageUsed} MB / {storageLimit} MB
            </Badge>
          </div>
          <Progress value={storagePercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {(100 - storagePercentage).toFixed(1)}% disponível ({(storageLimit - storageUsed)} MB restantes)
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar arquivos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="documentos">Documentos</SelectItem>
                    <SelectItem value="imagens">Imagens</SelectItem>
                    <SelectItem value="videos">Vídeos</SelectItem>
                    <SelectItem value="audios">Áudios</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Arquivos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Upload</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachments.map((attachment) => {
                    const IconComponent = getFileIcon(attachment.type);
                    return (
                      <TableRow key={attachment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{attachment.type}</Badge>
                        </TableCell>
                        <TableCell>{attachment.size}</TableCell>
                        <TableCell>{attachment.uploadDate}</TableCell>
                        <TableCell>{attachment.downloads}</TableCell>
                        <TableCell>
                          <Badge variant={attachment.active ? "default" : "secondary"}>
                            {attachment.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Documentos</h3>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">3.2 MB utilizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Imagens</h3>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">18</p>
                <p className="text-sm text-muted-foreground">1.8 MB utilizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">Vídeos</h3>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">156 MB utilizados</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissões por Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Administrador", "Supervisor", "Agente", "Estagiário"].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{role}</h4>
                      <p className="text-sm text-muted-foreground">
                        Configurar permissões de acesso aos anexos
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id={`${role}-view`} defaultChecked />
                        <Label htmlFor={`${role}-view`} className="text-sm">Visualizar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id={`${role}-download`} defaultChecked={role !== "Estagiário"} />
                        <Label htmlFor={`${role}-download`} className="text-sm">Download</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id={`${role}-upload`} defaultChecked={role === "Administrador" || role === "Supervisor"} />
                        <Label htmlFor={`${role}-upload`} className="text-sm">Upload</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Anexos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="max-file-size">Tamanho Máximo por Arquivo (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="allowed-extensions">Extensões Permitidas</Label>
                <Input 
                  id="allowed-extensions" 
                  defaultValue="pdf,doc,docx,xls,xlsx,png,jpg,jpeg,gif,mp4,mp3"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="scan-virus">Verificação de Vírus</Label>
                  <p className="text-sm text-muted-foreground">
                    Verificar arquivos automaticamente antes do upload
                  </p>
                </div>
                <Switch id="scan-virus" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup dos arquivos automaticamente
                  </p>
                </div>
                <Switch id="auto-backup" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compress-images">Compressão de Imagens</Label>
                  <p className="text-sm text-muted-foreground">
                    Comprimir imagens automaticamente para economizar espaço
                  </p>
                </div>
                <Switch id="compress-images" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
