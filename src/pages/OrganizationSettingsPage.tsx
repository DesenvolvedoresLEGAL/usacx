import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Building, Shield, Settings as SettingsIcon, Sliders } from 'lucide-react';
import OrganizationGeneralTab from '@/components/organization/OrganizationGeneralTab';
import PeopleTab from '@/components/organization/PeopleTab';
import { TeamsTab } from '@/components/users/TeamsTab';
import { RolesPermissionsTab } from '@/components/users/RolesPermissionsTab';
import OperationalConfigTab from '@/components/organization/OperationalConfigTab';
import AdvancedTab from '@/components/organization/AdvancedTab';

const OrganizationSettingsPage = () => {
  const { organization, orgMembership } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'geral';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  if (!organization) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Você não está vinculado a nenhuma organização.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwnerOrAdmin = orgMembership?.is_owner || orgMembership?.org_role === 'admin';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
            <p className="text-muted-foreground">
              Gerencie pessoas, times, funções e configurações da organização
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="geral" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="pessoas" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Pessoas</span>
          </TabsTrigger>
          <TabsTrigger value="times" className="gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Times</span>
          </TabsTrigger>
          <TabsTrigger value="funcoes" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Funções</span>
          </TabsTrigger>
          <TabsTrigger value="operacional" className="gap-2">
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Operacional</span>
          </TabsTrigger>
          {isOwnerOrAdmin && (
            <TabsTrigger value="avancado" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Avançado</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <OrganizationGeneralTab />
        </TabsContent>

        <TabsContent value="pessoas" className="space-y-4">
          <PeopleTab />
        </TabsContent>

        <TabsContent value="times" className="space-y-4">
          <TeamsTab />
        </TabsContent>

        <TabsContent value="funcoes" className="space-y-4">
          <RolesPermissionsTab />
        </TabsContent>

        <TabsContent value="operacional" className="space-y-4">
          <OperationalConfigTab />
        </TabsContent>

        {isOwnerOrAdmin && (
          <TabsContent value="avancado" className="space-y-4">
            <AdvancedTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrganizationSettingsPage;
