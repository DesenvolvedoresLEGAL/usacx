import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { AuditAccessLogsTab } from "@/components/audit/AuditAccessLogsTab";
import { AuditUserActivitiesTab } from "@/components/audit/AuditUserActivitiesTab";
import { AuditAttendanceTab } from "@/components/audit/AuditAttendanceTab";
import { useSearchParams } from "react-router-dom";

const AuditCenterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "access";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central de Auditoria</h1>
          <p className="text-muted-foreground">
            Monitore e audite todas as atividades do sistema em um único local
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Icons.history className="h-4 w-4" />
            <span className="hidden sm:inline">Logs de Acesso</span>
            <span className="sm:hidden">Acesso</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Icons.userCog className="h-4 w-4" />
            <span className="hidden sm:inline">Atividades de Usuários</span>
            <span className="sm:hidden">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Icons.shieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Auditoria de Atendimentos</span>
            <span className="sm:hidden">Atendimentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <AuditAccessLogsTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AuditUserActivitiesTab />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <AuditAttendanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditCenterPage;
