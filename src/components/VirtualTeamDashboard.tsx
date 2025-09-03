import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ConfigurationModal from "./ConfigurationModal";
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
  Settings
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
  llmModel: string;
  artifacts: string[];
}

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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [currentStep, setCurrentStep] = useState(2); // Research is current step
  const [showConfigModal, setShowConfigModal] = useState(false);

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

  const completedSteps = departments.filter(d => d.status === 'completed').length;
  const progressPercentage = (completedSteps / departments.length) * 100;

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

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-card via-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Progresso do Projeto
            </CardTitle>
            <CardDescription>
              {completedSteps} de {departments.length} departamentos concluídos
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

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {departments.map((dept, index) => (
            <Card 
              key={dept.id}
              className={`
                cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                ${dept.status === 'in-progress' ? 'ring-2 ring-warning/50 shadow-lg' : ''}
                ${dept.status === 'completed' ? 'bg-gradient-to-br from-card to-success/5' : ''}
                ${index === currentStep ? 'ring-2 ring-primary/50' : ''}
              `}
              onClick={() => setSelectedDepartment(dept)}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Próxima Etapa
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowConfigModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar LLMs
          </Button>
        </div>

        {/* Current Department Details */}
        {selectedDepartment && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedDepartment.icon}
                {selectedDepartment.name}
                <Badge variant={getModelBadgeVariant(selectedDepartment.llmModel)}>
                  {selectedDepartment.llmModel}
                </Badge>
              </CardTitle>
              <CardDescription>{selectedDepartment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Artefatos Gerados:</h4>
                  {selectedDepartment.artifacts.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedDepartment.artifacts.map((artifact, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success" />
                          {artifact}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum artefato gerado ainda.</p>
                  )}
                </div>
                {selectedDepartment.status === 'in-progress' && (
                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <p className="text-sm text-warning-foreground">
                      Este departamento está atualmente processando sua etapa do projeto...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration Modal */}
        <ConfigurationModal open={showConfigModal} onOpenChange={setShowConfigModal} />
      </div>
    </div>
  );
}