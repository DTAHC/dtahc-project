'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DossierForm } from '@/components/dossiers/DossierForm';
import { CreateDossierDto, Dossier, Client } from '@dtahc/shared';

export default function EditDossierPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données du dossier
        const dossierResponse = await fetch(`/api/dossiers/${id}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store',
        });
        
        if (!dossierResponse.ok) {
          throw new Error('Erreur lors de la récupération du dossier');
        }
        
        const dossierData = await dossierResponse.json();
        setDossier(dossierData);
        
        // Récupérer la liste des clients pour le sélecteur
        const clientsResponse = await fetch('/api/clients', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store',
        });
        
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          setClients(clientsData);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (data: CreateDossierDto) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/dossiers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Erreur lors de la mise à jour du dossier: ', response.status);
        
        try {
          const errorText = await response.text();
          console.error('Détail de l\'erreur:', errorText);
        } catch (e) {
          console.error('Impossible de lire le détail de l\'erreur');
        }
        
        throw new Error('Erreur lors de la mise à jour du dossier');
      }

      console.log('Dossier mis à jour avec succès');
      
      // Rediriger vers la page de détail du dossier
      router.push(`/dossiers/${id}?updated=true`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la mise à jour du dossier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="dossiers">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dossier) {
    return (
      <DashboardLayout activeMenu="dossiers">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Dossier non trouvé.</p>
            <button 
              onClick={() => router.push('/dossiers')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Retour à la liste des dossiers
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Préparer les données initiales pour le formulaire
  const initialData: Partial<CreateDossierDto> = {
    title: dossier.title,
    description: dossier.description || '',
    clientId: dossier.clientId,
    type: dossier.type,
    priority: dossier.priority,
    surfaceExistant: dossier.surfaceExistant === null ? undefined : dossier.surfaceExistant,
    surfaceProjet: dossier.surfaceProjet === null ? undefined : dossier.surfaceProjet,
    deadline: dossier.deadline ? new Date(dossier.deadline).toISOString().split('T')[0] : undefined
  };

  return (
    <DashboardLayout activeMenu="dossiers">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Modifier le dossier</h1>
          <p className="text-gray-600">Référence: {dossier.reference}</p>
        </div>

        <DossierForm 
          onSubmit={handleSubmit} 
          initialData={initialData} 
          isSubmitting={isSubmitting} 
          clients={clients}
          selectedClientId={dossier.clientId}
        />

        <div className="flex justify-end mt-6">
          <button 
            onClick={() => router.push(`/dossiers/${id}`)}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md mr-2"
          >
            Annuler
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}