'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Client } from '@dtahc/shared';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VueDocumentsClient from '@/components/clients/VueDocumentsClient';

export default function DocumentsClientPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Récupérer les informations du client
      const fetchClient = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/clients/${id}`);
          
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération du client');
          }
          
          const data = await response.json();
          setClient(data);
        } catch (error) {
          console.error('Erreur:', error);
          // En cas d'erreur, utiliser des données fictives pour la démo
          setClient(undefined);
        } finally {
          setIsLoading(false);
        }
      };

      fetchClient();
    }
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="clients">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="clients">
      <VueDocumentsClient client={client} />
    </DashboardLayout>
  );
}