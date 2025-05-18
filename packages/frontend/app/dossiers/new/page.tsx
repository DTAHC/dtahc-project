'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DossierForm } from '@/components/dossiers/DossierForm';
import { CreateDossierDto, Client } from '@dtahc/shared';

export default function NewDossierPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (data: CreateDossierDto) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/dossiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du dossier');
      }

      const dossier = await response.json();
      router.push(`/dossiers/${dossier.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du dossier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nouveau dossier</h1>
        <p className="text-gray-600">Créez un nouveau dossier en remplissant le formulaire ci-dessous.</p>
      </div>

      <DossierForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        clients={clients}
        selectedClientId={clientId || undefined}
      />
    </div>
  );
}