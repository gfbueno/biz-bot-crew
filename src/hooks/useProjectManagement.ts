import { useState, useCallback } from 'react';
import { Project, Department } from '@/types';
import { Building2, Search, Users, Code, Palette, TestTube, Rocket, HeadphonesIcon, Shield, BarChart3 } from 'lucide-react';

const defaultDepartments: Department[] = [
  {
    id: 'business-analysis',
    name: 'Análise de Negócio',
    description: 'Levantamento detalhado de requisitos e análise do mercado',
    icon: Building2,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'research',
    name: 'Pesquisa',
    description: 'Pesquisa de mercado, tecnologias e concorrência',
    icon: Search,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'ux-ui',
    name: 'UX/UI Design',
    description: 'Design de experiência do usuário e interface',
    icon: Palette,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'architecture',
    name: 'Arquitetura',
    description: 'Definição da arquitetura técnica do sistema',
    icon: Building2,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'development',
    name: 'Desenvolvimento',
    description: 'Implementação do código e funcionalidades',
    icon: Code,
    status: 'pending',
    llmModel: 'codellama',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'testing',
    name: 'Testes',
    description: 'Testes automatizados e validação de qualidade',
    icon: TestTube,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'deployment',
    name: 'Deploy',
    description: 'Configuração e deploy em produção',
    icon: Rocket,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'support',
    name: 'Suporte',
    description: 'Documentação e suporte técnico',
    icon: HeadphonesIcon,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'security',
    name: 'Segurança',
    description: 'Auditoria e implementação de segurança',
    icon: Shield,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Implementação de métricas e analytics',
    icon: BarChart3,
    status: 'pending',
    llmModel: 'gemini-pro',
    artifacts: [],
    isEnabled: true
  }
];

export function useProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      clientId: '1',
      name: 'Sistema de Gestão ERP',
      description: 'Sistema completo de gestão empresarial',
      status: 'in-progress',
      activeDepartments: ['business-analysis', 'research', 'development'],
      currentStep: 2,
      departments: defaultDepartments.map(dept => 
        dept.id === 'research' ? { ...dept, status: 'in-progress' as const } : dept
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
      budget: 50000
    }
  ]);

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'departments'>) => {
    const enabledDepartments = defaultDepartments.map(dept => ({
      ...dept,
      isEnabled: projectData.activeDepartments.includes(dept.id),
      status: dept.isEnabled ? 'pending' as const : 'disabled' as const
    }));

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      departments: enabledDepartments,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...projectData, updatedAt: new Date() }
        : project
    ));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  const getProject = useCallback((id: string) => {
    return projects.find(project => project.id === id);
  }, [projects]);

  const getProjectsByClient = useCallback((clientId: string) => {
    return projects.filter(project => project.clientId === clientId);
  }, [projects]);

  const updateDepartmentConfig = useCallback((projectId: string, departmentId: string, config: Partial<Department>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            departments: project.departments.map(dept =>
              dept.id === departmentId ? { ...dept, ...config } : dept
            ),
            updatedAt: new Date()
          }
        : project
    ));
  }, []);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjectsByClient,
    updateDepartmentConfig,
    defaultDepartments
  };
}