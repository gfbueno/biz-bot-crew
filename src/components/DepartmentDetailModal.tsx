import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Play, 
  FileText, 
  Code, 
  Download,
  Eye,
  Sparkles
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
  llmModel: string;
  artifacts: string[];
  tasks?: string[];
  estimatedTime?: string;
  completionPercentage?: number;
}

interface DepartmentDetailModalProps {
  department: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartWork?: (departmentId: string) => void;
  onApproveWork?: (departmentId: string) => void;
}

export default function DepartmentDetailModal({ 
  department, 
  open, 
  onOpenChange,
  onStartWork,
  onApproveWork
}: DepartmentDetailModalProps) {
  const { toast } = useToast();

  if (!department) return null;

  const handleStartWork = () => {
    onStartWork?.(department.id);
    toast({
      title: "Trabalho Iniciado",
      description: `O departamento ${department.name} começou o trabalho.`,
    });
  };

  const handleApproveWork = () => {
    onApproveWork?.(department.id);
    toast({
      title: "Trabalho Aprovado",
      description: `Os artefatos do ${department.name} foram aprovados.`,
    });
  };

  const getStatusColor = (status: Department['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'secondary';
    }
  };

  const getStatusText = (status: Department['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in-progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {department.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {department.name}
                <Badge 
                  variant={getStatusColor(department.status) as any}
                  className="ml-2"
                >
                  {department.status === 'in-progress' && (
                    <Clock className="w-3 h-3 mr-1 animate-pulse" />
                  )}
                  {department.status === 'completed' && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {getStatusText(department.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Usando modelo: {department.llmModel}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            {department.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="artifacts">Artefatos</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-4">
              {/* Progress Card */}
              {department.status === 'in-progress' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Progresso Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processando...</span>
                        <span>{department.completionPercentage || 45}%</span>
                      </div>
                      <Progress value={department.completionPercentage || 45} />
                      <p className="text-xs text-muted-foreground">
                        Tempo estimado restante: {department.estimatedTime || '2-3 minutos'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status do Departamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Modelo de IA:</span>
                      <Badge variant="outline">{department.llmModel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Artefatos gerados:</span>
                      <span className="text-sm font-medium">{department.artifacts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant={getStatusColor(department.status) as any}>
                        {getStatusText(department.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="artifacts" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {department.artifacts.length > 0 ? (
                  department.artifacts.map((artifact, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="font-medium">{artifact}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum artefato gerado ainda</p>
                    <p className="text-sm">Os artefatos aparecerão aqui após o trabalho ser concluído</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {(department.tasks || [
                  'Análise dos requisitos',
                  'Pesquisa de tecnologias',
                  'Criação de documentação',
                  'Revisão e validação'
                ]).map((task, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded border">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configuração de IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Modelo Atual:</label>
                      <p className="text-sm text-muted-foreground">{department.llmModel}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium">Especialização:</label>
                      <p className="text-sm text-muted-foreground">
                        {department.id.includes('development') ? 'Desenvolvimento de código' : 
                         department.id.includes('design') ? 'Design e UX/UI' :
                         'Análise e documentação'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          
          {department.status === 'pending' && (
            <Button onClick={handleStartWork} className="bg-gradient-to-r from-primary to-accent">
              <Play className="w-4 h-4 mr-2" />
              Iniciar Trabalho
            </Button>
          )}
          
          {department.status === 'completed' && (
            <Button onClick={handleApproveWork} variant="default">
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar & Continuar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}