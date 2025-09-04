import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Settings, Bot, User, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useChat } from '@/hooks/useChat';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useClientManagement } from '@/hooks/useClientManagement';
import { ChatMessage } from '@/types';

interface ProjectChatProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectChat({ projectId, onBack }: ProjectChatProps) {
  const { messages, isLoading, sendMessage } = useChat(projectId);
  const { getProject, defaultDepartments } = useProjectManagement();
  const { getClient } = useClientManagement();
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const project = getProject(projectId);
  const client = project ? getClient(project.clientId) : null;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDepartmentInfo = (departmentId?: string) => {
    if (!departmentId) return null;
    return defaultDepartments.find(d => d.id === departmentId);
  };

  const renderMessage = (message: ChatMessage) => {
    const department = getDepartmentInfo(message.departmentId);
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isDepartment = message.sender === 'department';

    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <div className="flex items-center gap-1">
                {isSystem && <Bot className="h-4 w-4 text-primary" />}
                {isDepartment && department && (
                  <div className="flex items-center gap-1">
                    {React.createElement(department.icon as any, { className: "h-4 w-4 text-primary" })}
                    <span className="text-xs font-medium text-primary">{department.name}</span>
                  </div>
                )}
                {!isDepartment && !isSystem && <User className="h-4 w-4 text-muted-foreground" />}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : message.type === 'artifact'
                ? 'bg-accent border border-accent-foreground/20'
                : 'bg-muted'
          }`}>
            {message.type === 'artifact' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Artefato Gerado</span>
                </div>
                <div className="text-sm bg-card p-2 rounded border">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {message.content}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!project || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="font-semibold">{project.name}</h2>
              <p className="text-sm text-muted-foreground">
                {client.name} - {client.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{project.activeDepartments.length} departamentos ativos</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.map(renderMessage)}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Processando...</span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar - Project Info */}
        <div className="w-80 border-l bg-muted/30">
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Departamentos Ativos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.departments
                  .filter(d => d.isEnabled)
                  .map((dept) => {
                    const deptInfo = getDepartmentInfo(dept.id);
                    const statusColor = dept.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                                      dept.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-600' :
                                      'bg-gray-500/10 text-gray-600';
                    
                    return (
                      <div key={dept.id} className="flex items-center justify-between p-2 rounded-lg border">
                        <div className="flex items-center gap-2">
                          {deptInfo && React.createElement(deptInfo.icon as any, { className: "h-4 w-4" })}
                          <span className="text-sm font-medium">{dept.name}</span>
                        </div>
                        <Badge className={statusColor} variant="secondary">
                          {dept.status === 'completed' ? 'Concluído' :
                           dept.status === 'in-progress' ? 'Ativo' : 'Pendente'}
                        </Badge>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-muted-foreground capitalize">{project.status}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                {project.budget && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium">Orçamento</label>
                      <p className="text-sm text-muted-foreground">
                        R$ {project.budget.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}