import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Settings } from 'lucide-react';
import OrganizationGeneralTab from '@/components/organization/OrganizationGeneralTab';
import OrganizationMembersTab from '@/components/organization/OrganizationMembersTab';

const OrganizationSettingsPage = () => {
  const { organization, orgMembership } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações da Organização</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e membros de {organization.name}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Membros
          </TabsTrigger>
          {isOwnerOrAdmin && (
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Avançado
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <OrganizationGeneralTab />
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <OrganizationMembersTab />
        </TabsContent>

        {isOwnerOrAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações avançadas da organização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Slug:</strong> {organization.slug}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Plano:</strong> {organization.plan.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>ID:</strong> {organization.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrganizationSettingsPage;