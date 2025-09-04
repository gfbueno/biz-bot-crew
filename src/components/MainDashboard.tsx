import React, { useState } from 'react';
import { Users, FolderOpen, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientManagement } from '@/components/ClientManagement';
import { ProjectManagement } from '@/components/ProjectManagement';
import { ProjectChat } from '@/components/ProjectChat';
import { VirtualTeamDashboard } from '@/components/VirtualTeamDashboard';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useProjectManagement } from '@/hooks/useProjectManagement';

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeChatProject, setActiveChatProject] = useState<string | null>(null);
  const { clients } = useClientManagement();
  const { projects } = useProjectManagement();

  const handleOpenChat = (projectId: string) => {
    setActiveChatProject(projectId);
    setActiveTab('chat');
  };

  const handleCloseChat = () => {
    setActiveChatProject(null);
    setActiveTab('projects');
  };

  const getOverviewStats = () => {
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalClients = clients.length;
    
    return {
      totalClients,
      totalProjects: projects.length,
      activeProjects,
      completedProjects
    };
  };

  const stats = getOverviewStats();

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Principal</h1>
        <p className="text-muted-foreground">
          Visão geral da sua plataforma de desenvolvimento virtual
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              projetos criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              finalizados com sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>
              Últimos projetos criados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => {
                const client = clients.find(c => c.id === project.clientId);
                return (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client?.name} - {client?.company}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenChat(project.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Ativos</CardTitle>
            <CardDescription>
              Clientes com projetos em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => {
                const clientProjects = projects.filter(p => p.clientId === client.id);
                const activeProjects = clientProjects.filter(p => p.status === 'in-progress');
                
                return (
                  <div key={client.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.company} - {clientProjects.length} projeto(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {activeProjects.length} ativo(s)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipe Virtual</CardTitle>
          <CardDescription>
            Departamentos disponíveis para seus projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VirtualTeamDashboard isEmbedded />
        </CardContent>
      </Card>
    </div>
  );

  if (activeTab === 'chat' && activeChatProject) {
    return (
      <ProjectChat 
        projectId={activeChatProject} 
        onBack={handleCloseChat}
      />
    );
  }

  return (
    <div className="h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b">
          <div className="container mx-auto px-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="clients">
                <Users className="h-4 w-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                Projetos
              </TabsTrigger>
              <TabsTrigger value="team">
                <Settings className="h-4 w-4 mr-2" />
                Equipe Virtual
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 container mx-auto px-4 py-6 overflow-auto">
          <TabsContent value="overview" className="mt-0">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="clients" className="mt-0">
            <ClientManagement />
          </TabsContent>
          
          <TabsContent value="projects" className="mt-0">
            <ProjectManagement onOpenChat={handleOpenChat} />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <VirtualTeamDashboard />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}