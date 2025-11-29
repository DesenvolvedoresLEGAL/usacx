import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { HelpSupportTab } from "@/components/help/HelpSupportTab";
import { HelpStatusTab } from "@/components/help/HelpStatusTab";
import { HelpVersionTab } from "@/components/help/HelpVersionTab";
import { HelpAccountTab } from "@/components/help/HelpAccountTab";
import { useSearchParams } from "react-router-dom";

const HelpCenterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "support";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
          <p className="text-muted-foreground">
            Suporte técnico, status do sistema e informações da sua conta
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Icons.messageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Suporte</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Icons.info className="h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </TabsTrigger>
          <TabsTrigger value="version" className="flex items-center gap-2">
            <Icons.packageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Versão</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Icons.xOctagon className="h-4 w-4" />
            <span className="hidden sm:inline">Minha Conta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-4">
          <HelpSupportTab />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <HelpStatusTab />
        </TabsContent>

        <TabsContent value="version" className="space-y-4">
          <HelpVersionTab />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <HelpAccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenterPage;
