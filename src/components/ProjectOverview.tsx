import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Rocket, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  FileText,
  CheckCircle,
  Calendar,
  Zap
} from "lucide-react";

interface ProjectStats {
  totalDepartments: number;
  completedDepartments: number;
  inProgressDepartments: number;
  totalArtifacts: number;
  estimatedCompletion: string;
  timeSpent: string;
}

interface ProjectOverviewProps {
  stats: ProjectStats;
  onExportProject?: () => void;
  onGenerateReport?: () => void;
}

export default function ProjectOverview({ 
  stats, 
  onExportProject, 
  onGenerateReport 
}: ProjectOverviewProps) {
  const progressPercentage = (stats.completedDepartments / stats.totalDepartments) * 100;

  const milestones = [
    { name: "Análise de Requisitos", completed: true, date: "2024-01-15" },
    { name: "Planejamento", completed: true, date: "2024-01-16" },
    { name: "Pesquisa & Análise", completed: false, date: "2024-01-17" },
    { name: "Design UX/UI", completed: false, date: "2024-01-18" },
    { name: "Arquitetura", completed: false, date: "2024-01-19" },
    { name: "Desenvolvimento", completed: false, date: "2024-01-22" },
    { name: "Testes", completed: false, date: "2024-01-25" },
    { name: "Deploy", completed: false, date: "2024-01-26" }
  ];

  const recentActivity = [
    { action: "Business Requirements Document gerado", time: "há 5 min", department: "Análise de Negócio" },
    { action: "Project Charter criado", time: "há 10 min", department: "Gerência de Projetos" },
    { action: "Feasibility Analysis concluída", time: "há 15 min", department: "Análise de Negócio" },
    { action: "Timeline & Milestones definidos", time: "há 20 min", department: "Gerência de Projetos" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedDepartments} de {stats.totalDepartments} departamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artefatos Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtifacts}</div>
            <p className="text-xs text-muted-foreground">
              Documentos e códigos criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Gasto</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSpent}</div>
            <p className="text-xs text-muted-foreground">
              Desde o início do projeto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conclusão Estimada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.estimatedCompletion}</div>
            <p className="text-xs text-muted-foreground">
              Com o ritmo atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Progresso do Projeto
              </CardTitle>
              <CardDescription>
                Acompanhe o desenvolvimento em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Total</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-success">{stats.completedDepartments}</div>
                    <div className="text-xs text-muted-foreground">Concluídos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-warning">{stats.inProgressDepartments}</div>
                    <div className="text-xs text-muted-foreground">Em Progresso</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">
                      {stats.totalDepartments - stats.completedDepartments - stats.inProgressDepartments}
                    </div>
                    <div className="text-xs text-muted-foreground">Pendentes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Cronograma do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`w-2 h-2 rounded-full ${
                        milestone.completed ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {milestone.name}
                          </span>
                          {milestone.completed && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{milestone.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.department} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Projeto</CardTitle>
              <CardDescription>
                Baixe relatórios e artefatos do seu projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={onGenerateReport} variant="outline" className="h-16">
                  <div className="text-center">
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm">Relatório Completo</div>
                  </div>
                </Button>
                
                <Button onClick={onExportProject} variant="outline" className="h-16">
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm">Exportar Código</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}