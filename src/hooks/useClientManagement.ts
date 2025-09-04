import { useState, useCallback } from 'react';
import { Client } from '@/types';

export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      company: 'Tech Solutions Ltda',
      description: 'Empresa de soluções tecnológicas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@startup.com',
      phone: '(21) 88888-8888',
      company: 'Startup Inovadora',
      description: 'Startup focada em inovação digital',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const createClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...clientData, updatedAt: new Date() }
        : client
    ));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  }, []);

  const getClient = useCallback((id: string) => {
    return clients.find(client => client.id === id);
  }, [clients]);

  return {
    clients,
    createClient,
    updateClient,
    deleteClient,
    getClient
  };
}