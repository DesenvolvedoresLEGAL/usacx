import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserListTab } from "@/components/users/UserListTab";
import { RolesPermissionsTab } from "@/components/users/RolesPermissionsTab";
import { TeamsTab } from "@/components/users/TeamsTab";
import { OperationalConfigTab } from "@/components/users/OperationalConfigTab";
import { SecurityTab } from "@/components/users/SecurityTab";
import { AuditTab } from "@/components/users/AuditTab";
import { Users, Shield, Building2, Settings, Lock, FileText } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const UserManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "usuarios";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* CABEÇALHO */}
      <header className="border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários, permissões, times e configurações de segurança em um único local.
          </p>
        </div>
      </header>

      {/* TABS PRINCIPAIS */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="times" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Times</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Auditoria</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="flex-1 overflow-hidden">
          <UserListTab />
        </TabsContent>

        <TabsContent value="roles" className="flex-1 overflow-hidden">
          <RolesPermissionsTab />
        </TabsContent>

        <TabsContent value="times" className="flex-1 overflow-hidden">
          <TeamsTab />
        </TabsContent>

        <TabsContent value="config" className="flex-1 overflow-hidden">
          <OperationalConfigTab />
        </TabsContent>

        <TabsContent value="seguranca" className="flex-1 overflow-hidden">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="auditoria" className="flex-1 overflow-hidden">
          <AuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
