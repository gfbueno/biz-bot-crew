import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';

export function useChat(projectId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      projectId,
      sender: 'system',
      content: 'Bem-vindo ao chat do projeto! Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId,
      sender: 'user',
      content,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        projectId,
        sender: 'system',
        departmentId: 'business-analysis',
        content: `Entendi sua solicitação: "${content}". Vou processar isso e retornar em breve com uma análise detalhada.`,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  }, [projectId]);

  const addArtifactMessage = useCallback((departmentId: string, artifactContent: string) => {
    const artifactMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId,
      sender: 'department',
      departmentId,
      content: artifactContent,
      timestamp: new Date(),
      type: 'artifact'
    };

    setMessages(prev => [...prev, artifactMessage]);
  }, [projectId]);

  return {
    messages,
    isLoading,
    sendMessage,
    addArtifactMessage
  };
}