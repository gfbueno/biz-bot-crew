import { useState, useCallback } from 'react';

export interface Department {
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

export interface ProjectState {
  currentStep: number;
  departments: Department[];
  projectName: string;
  startDate: Date;
}

export function useProjectState(initialDepartments: Department[]) {
  const [state, setState] = useState<ProjectState>({
    currentStep: 2, // Research is current step
    departments: initialDepartments,
    projectName: "Virtual Dev Team Platform",
    startDate: new Date()
  });

  const updateDepartmentStatus = useCallback((departmentId: string, status: Department['status']) => {
    setState(prev => ({
      ...prev,
      departments: prev.departments.map(dept => 
        dept.id === departmentId ? { ...dept, status } : dept
      )
    }));
  }, []);

  const addArtifact = useCallback((departmentId: string, artifact: string) => {
    setState(prev => ({
      ...prev,
      departments: prev.departments.map(dept => 
        dept.id === departmentId 
          ? { ...dept, artifacts: [...dept.artifacts, artifact] }
          : dept
      )
    }));
  }, []);

  const updateProgress = useCallback((departmentId: string, percentage: number) => {
    setState(prev => ({
      ...prev,
      departments: prev.departments.map(dept => 
        dept.id === departmentId 
          ? { ...dept, completionPercentage: percentage }
          : dept
      )
    }));
  }, []);

  const startNextDepartment = useCallback(() => {
    const nextPendingIndex = state.departments.findIndex(dept => dept.status === 'pending');
    if (nextPendingIndex !== -1) {
      setState(prev => ({
        ...prev,
        currentStep: nextPendingIndex,
        departments: prev.departments.map((dept, index) => 
          index === nextPendingIndex 
            ? { ...dept, status: 'in-progress' as const }
            : dept
        )
      }));
    }
  }, [state.departments]);

  const completeCurrentDepartment = useCallback(() => {
    setState(prev => ({
      ...prev,
      departments: prev.departments.map((dept, index) => 
        index === prev.currentStep 
          ? { ...dept, status: 'completed' as const }
          : dept
      )
    }));
  }, []);

  const getProjectStats = useCallback(() => {
    const completed = state.departments.filter(d => d.status === 'completed').length;
    const inProgress = state.departments.filter(d => d.status === 'in-progress').length;
    const totalArtifacts = state.departments.reduce((acc, dept) => acc + dept.artifacts.length, 0);
    
    return {
      totalDepartments: state.departments.length,
      completedDepartments: completed,
      inProgressDepartments: inProgress,
      totalArtifacts,
      estimatedCompletion: "2-3 horas",
      timeSpent: "45 min"
    };
  }, [state.departments]);

  return {
    state,
    updateDepartmentStatus,
    addArtifact,
    updateProgress,
    startNextDepartment,
    completeCurrentDepartment,
    getProjectStats
  };
}