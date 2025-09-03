import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigurationModal from "./ConfigurationModal";
import DepartmentDetailModal from "./DepartmentDetailModal";
import ProjectOverview from "./ProjectOverview";
import { useProjectState, type Department } from "@/hooks/useProjectState";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Code, 
  Palette, 
  Shield, 
  Users, 
  Search, 
  FileText, 
  Rocket, 
  Bug, 
  Briefcase,
  Play,
  CheckCircle,
  Clock,
  Settings,
  BarChart3,
  Zap
} from "lucide-react";

// Department interface moved to useProjectState hook

const departments: Department[] = [
  {
    id: "business-analysis",
    name: "Análise de Negócio",
    description: "Análise de viabilidade e requisitos do projeto",
    icon: <Briefcase className="w-6 h-6" />,
    status: "completed",
    llmModel: "gemini-pro",
    artifacts: ["Business Requirements Document", "Feasibility Analysis"]
  },
  {
    id: "project-management",
    name: "Gerência de Projetos",
    description: "Planejamento e cronograma do projeto",
    icon: <Users className="w-6 h-6" />,
    status: "completed",
    llmModel: "gemini-pro",
    artifacts: ["Project Charter", "Timeline & Milestones"]
  },
  {
    id: "research",
    name: "Pesquisa & Análise",
    description: "Pesquisa de mercado e análise competitiva",
    icon: <Search className="w-6 h-6" />,
    status: "in-progress",
    llmModel: "gemini-pro",
    artifacts: ["Market Research Report"]
  },
  {
    id: "ux-design",
    name: "UX/UI Design",
    description: "Design de experiência e interface do usuário",
    icon: <Palette className="w-6 h-6" />,
    status: "pending",
    llmModel: "gemini-pro",
    artifacts: []
  },
  {
    id: "architecture",
    name: "Arquitetura de Software",
    description: "Design da arquitetura e tecnologias",
    icon: <Brain className="w-6 h-6" />,
    status: "pending",
    llmModel: "codellama",
    artifacts: []
  },
  {
    id: "development",
    name: "Desenvolvimento",
    description: "Implementação do código e funcionalidades",
    icon: <Code className="w-6 h-6" />,
    status: "pending",
    llmModel: "codellama",
    artifacts: []
  },
  {
    id: "testing",
    name: "Testes & QA",
    description: "Testes automatizados e garantia de qualidade",
    icon: <Bug className="w-6 h-6" />,
    status: "pending",
    llmModel: "gemini-pro",
    artifacts: []
  },
  {
    id: "security",
    name: "Segurança",
    description: "Análise de segurança e vulnerabilidades",
    icon: <Shield className="w-6 h-6" />,
    status: "pending",
    llmModel: "gemini-pro",
    artifacts: []
  },
  {
    id: "documentation",
    name: "Documentação",
    description: "Documentação técnica e do usuário",
    icon: <FileText className="w-6 h-6" />,
    status: "pending",
    llmModel: "gemini-pro",
    artifacts: []
  },
  {
    id: "deployment",
    name: "Deploy & DevOps",
    description: "Deployment e configuração de infraestrutura",
    icon: <Rocket className="w-6 h-6" />,
    status: "pending",
    llmModel: "gemini-pro",
    artifacts: []
  }
];

export default function VirtualTeamDashboard() {
  const { 
    state, 
    updateDepartmentStatus, 
    addArtifact, 
    updateProgress, 
    startNextDepartment, 
    completeCurrentDepartment,
    getProjectStats 
  } = useProjectState(departments);
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const getStatusIcon = (status: Department['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getModelBadgeVariant = (model: string) => {
    return model.includes('codellama') ? 'secondary' : 'outline';
  };

  const handleDepartmentClick = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowDetailModal(true);
  };

  const handleStartWork = (departmentId: string) => {
    updateDepartmentStatus(departmentId, 'in-progress');
    
    // Simulate work progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      updateProgress(departmentId, Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        updateDepartmentStatus(departmentId, 'completed');
        
        // Add sample artifacts
        addArtifact(departmentId, "Documento de Análise");
        addArtifact(departmentId, "Especificações Técnicas");
        
        toast({
          title: "Trabalho Concluído!",
          description: "O departamento finalizou suas tarefas com sucesso.",
        });
      }
    }, 1000);
  };

  const handleApproveWork = (departmentId: string) => {
    startNextDepartment();
    setShowDetailModal(false);
    toast({
      title: "Etapa Aprovada",
      description: "Próximo departamento foi iniciado automaticamente.",
    });
  };

  const stats = getProjectStats();
  const progressPercentage = (stats.completedDepartments / stats.totalDepartments) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full border">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Equipe Virtual de IA</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Virtual Dev Team Platform
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma inteligente que simula uma equipe completa de desenvolvimento, 
            onde cada departamento é gerenciado por agentes de IA especializados.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Visão Geral
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {activeTab === "dashboard" && (
          <>
            {/* Progress Overview */}
            <Card className="bg-gradient-to-r from-card via-card to-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Progresso do Projeto
                </CardTitle>
                <CardDescription>
                  {stats.completedDepartments} de {stats.totalDepartments} departamentos concluídos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Iniciado</span>
                    <span>{Math.round(progressPercentage)}% concluído</span>
                    <span>Deploy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "dashboard" && (
          <>
            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {state.departments.map((dept, index) => (
                <Card 
                  key={dept.id}
                  className={`
                    cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                    ${dept.status === 'in-progress' ? 'ring-2 ring-warning/50 shadow-lg' : ''}
                    ${dept.status === 'completed' ? 'bg-gradient-to-br from-card to-success/5' : ''}
                    ${index === state.currentStep ? 'ring-2 ring-primary/50' : ''}
                  `}
                  onClick={() => handleDepartmentClick(dept)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {dept.icon}
                      </div>
                      {getStatusIcon(dept.status)}
                    </div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {dept.description}
                    </p>
                    <div className="space-y-2">
                      <Badge variant={getModelBadgeVariant(dept.llmModel)} className="text-xs">
                        {dept.llmModel}
                      </Badge>
                      {dept.artifacts.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {dept.artifacts.length} artefato(s)
                        </div>
                      )}
                      {dept.status === 'in-progress' && dept.completionPercentage && (
                        <div className="w-full">
                          <Progress value={dept.completionPercentage} className="h-1" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "overview" && (
          <ProjectOverview 
            stats={stats}
            onExportProject={() => toast({ title: "Exportando projeto...", description: "Download iniciará em breve." })}
            onGenerateReport={() => toast({ title: "Gerando relatório...", description: "Relatório será criado em instantes." })}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={startNextDepartment}
            disabled={stats.inProgressDepartments > 0}
          >
            <Play className="w-4 h-4 mr-2" />
            {stats.inProgressDepartments > 0 ? 'Aguarde Etapa Atual...' : 'Iniciar Próxima Etapa'}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowConfigModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar LLMs
          </Button>
          <Button variant="outline" size="lg" onClick={() => setActiveTab("overview")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Relatórios
          </Button>
        </div>

        {/* Modals */}
        <ConfigurationModal open={showConfigModal} onOpenChange={setShowConfigModal} />
        <DepartmentDetailModal 
          department={selectedDepartment}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onStartWork={handleStartWork}
          onApproveWork={handleApproveWork}
        />
      </div>
    </div>
  );
}