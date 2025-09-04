import React, { useState } from 'react';
import { Plus, Edit, Trash2, MessageSquare, Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useClientManagement } from '@/hooks/useClientManagement';
import { Project } from '@/types';

interface ProjectManagementProps {
  onOpenChat: (projectId: string) => void;
}

export function ProjectManagement({ onOpenChat }: ProjectManagementProps) {
  const { projects, createProject, updateProject, deleteProject, defaultDepartments } = useProjectManagement();
  const { clients } = useClientManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    activeDepartments: [] as string[],
    budget: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      status: 'planning' as const,
      currentStep: 0
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      createProject(projectData);
    }
    
    setFormData({ name: '', description: '', clientId: '', activeDepartments: [], budget: 0 });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      activeDepartments: project.activeDepartments,
      budget: project.budget || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(projectId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/10 text-blue-600';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-600';
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'paused': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planejamento';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return 'Desconhecido';
    }
  };

  const calculateProgress = (project: Project) => {
    const activeDepts = project.departments.filter(d => d.isEnabled);
    const completedDepts = activeDepts.filter(d => d.status === 'completed');
    return activeDepts.length > 0 ? (completedDepts.length / activeDepts.length) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os projetos dos seus clientes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProject(null);
              setFormData({ name: '', description: '', clientId: '', activeDepartments: [], budget: 0 });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? 'Edite as informações do projeto.' : 'Crie um novo projeto e configure os departamentos.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select 
                  value={formData.clientId} 
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do projeto..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-3">
                <Label>Departamentos Ativos</Label>
                <p className="text-sm text-muted-foreground">
                  Selecione quais departamentos participarão deste projeto:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {defaultDepartments.map((dept) => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept.id}
                        checked={formData.activeDepartments.includes(dept.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              activeDepartments: [...formData.activeDepartments, dept.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              activeDepartments: formData.activeDepartments.filter(id => id !== dept.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={dept.id} className="text-sm">
                        {dept.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProject ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const client = clients.find(c => c.id === project.clientId);
          const progress = calculateProgress(project);
          
          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {client?.name} - {client?.company}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenChat(project.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                  {project.budget && (
                    <span className="text-sm font-medium">
                      R$ {project.budget.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.activeDepartments.slice(0, 3).map((deptId) => {
                    const dept = defaultDepartments.find(d => d.id === deptId);
                    return (
                      <Badge key={deptId} variant="secondary" className="text-xs">
                        {dept?.name}
                      </Badge>
                    );
                  })}
                  {project.activeDepartments.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.activeDepartments.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onOpenChat(project.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}