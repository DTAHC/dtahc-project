'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dossier, WorkflowState, DossierStatus, Priority } from '@dtahc/shared';

export default function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDossierData = async () => {
      try {
        const response = await fetch(`/api/dossiers/${id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du dossier');
        }
        
        const dossierData = await response.json();
        setDossier(dossierData);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDossierData();
    }
  }, [id]);

  // Fonction pour obtenir la couleur de statut
  const getStatusColor = (status: DossierStatus) => {
    switch (status) {
      case DossierStatus.NOUVEAU:
        return 'bg-blue-100 text-blue-800';
      case DossierStatus.EN_COURS:
        return 'bg-yellow-100 text-yellow-800';
      case DossierStatus.EN_ATTENTE:
        return 'bg-orange-100 text-orange-800';
      case DossierStatus.TERMINE:
        return 'bg-green-100 text-green-800';
      case DossierStatus.ARCHIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.FAIBLE:
        return 'bg-green-100 text-green-800';
      case Priority.NORMAL:
        return 'bg-blue-100 text-blue-800';
      case Priority.URGENT:
        return 'bg-orange-100 text-orange-800';
      case Priority.CRITIQUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  if (!dossier) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Dossier non trouvé.</p>
          <Link 
            href="/dossiers" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Retour à la liste des dossiers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              href="/dossiers" 
              className="text-blue-600 hover:text-blue-800"
            >
              Dossiers
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold">
              {dossier.title}
            </h1>
          </div>
          <p className="text-gray-600">{dossier.reference}</p>
        </div>
        
        <div className="flex space-x-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(dossier.status)}`}>
            {dossier.status}
          </span>
          
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(dossier.priority)}`}>
            {dossier.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations du dossier</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Type de dossier</p>
                <p className="font-medium">{dossier.type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">État du workflow</p>
                <p className="font-medium">{dossier.workflowState}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date de création</p>
                <p className="font-medium">{formatDate(dossier.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date d'échéance</p>
                <p className="font-medium">{formatDate(dossier.deadline)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Surface existante</p>
                <p className="font-medium">
                  {dossier.surfaceExistant ? `${dossier.surfaceExistant} m²` : 'Non renseignée'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Surface projet</p>
                <p className="font-medium">
                  {dossier.surfaceProjet ? `${dossier.surfaceProjet} m²` : 'Non renseignée'}
                </p>
              </div>
            </div>
            
            {dossier.description && (
              <div>
                <h3 className="text-md font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{dossier.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Client</h2>
            
            {dossier.client ? (
              <>
                <p className="font-medium mb-2">
                  {dossier.client.contactInfo?.firstName} {dossier.client.contactInfo?.lastName}
                </p>
                <p className="text-sm text-gray-600 mb-1">{dossier.client.reference}</p>
                <p className="text-sm text-gray-600 mb-1">{dossier.client.contactInfo?.email}</p>
                <p className="text-sm text-gray-600 mb-4">{dossier.client.contactInfo?.phone}</p>
                
                <Link 
                  href={`/clients/${dossier.clientId}`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Voir détails du client →
                </Link>
              </>
            ) : (
              <p className="text-sm text-gray-500">Client non trouvé</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Responsables</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Créé par</p>
              <p className="font-medium">
                {dossier.createdBy ? 
                  `${dossier.createdBy.firstName} ${dossier.createdBy.lastName}` : 
                  'Non spécifié'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Assigné à</p>
              <p className="font-medium">
                {dossier.assignedTo ? 
                  `${dossier.assignedTo.firstName} ${dossier.assignedTo.lastName}` : 
                  'Non assigné'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Link 
          href="/dossiers" 
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md"
        >
          Retour
        </Link>
        
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Modifier
        </button>
      </div>
    </div>
  );
}