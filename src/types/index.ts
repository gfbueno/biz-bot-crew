export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  activeDepartments: string[];
  currentStep: number;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: string;
  budget?: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: any; // Lucide icon component
  status: 'pending' | 'in-progress' | 'completed' | 'disabled';
  llmModel: string;
  artifacts: string[];
  tasks?: string[];
  estimatedTime?: string;
  completionPercentage?: number;
  isEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  sender: 'user' | 'system' | 'department';
  departmentId?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'artifact' | 'system';
}

export interface ProjectStats {
  totalDepartments: number;
  activeDepartments: number;
  completedDepartments: number;
  inProgressDepartments: number;
  totalArtifacts: number;
  estimatedCompletion: string;
  timeSpent: string;
}