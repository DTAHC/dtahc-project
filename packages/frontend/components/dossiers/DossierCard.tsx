import React from 'react';
import Link from 'next/link';
import { Dossier, WorkflowState, Priority, DossierStatus } from '@dtahc/shared';
import { formatDossierId } from '@/utils/formatters';

interface DossierCardProps {
  dossier: Dossier;
}

export const DossierCard: React.FC<DossierCardProps> = ({ dossier }) => {
  // Fonction pour obtenir la couleur de statut
  const getStatusColor = (status: DossierStatus) => {
    switch (status) {
      case DossierStatus.NOUVEAU:
        return 'bg-blue-100 text-blue-800';
      case DossierStatus.LIVRE_CLIENT:
        return 'bg-green-100 text-green-800';
      case DossierStatus.DEPOT_EN_LIGNE:
        return 'bg-teal-100 text-teal-800';
      case DossierStatus.TOP_URGENT:
        return 'bg-red-100 text-red-800';
      case DossierStatus.ANNULE:
        return 'bg-gray-100 text-gray-800';
      case DossierStatus.INCOMPLETUDE_MAIRIE:
        return 'bg-yellow-100 text-yellow-800';
      case DossierStatus.REFUS:
        return 'bg-red-100 text-red-800';
      case DossierStatus.A_DEPOSER_EN_LIGNE:
        return 'bg-purple-100 text-purple-800';
      case DossierStatus.A_ENVOYER_AU_CLIENT:
        return 'bg-indigo-100 text-indigo-800';
      case DossierStatus.EN_INSTRUCTION:
        return 'bg-orange-100 text-orange-800';
      case DossierStatus.ACCEPTE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'bg-green-100 text-green-800';
      case Priority.NORMAL:
        return 'bg-blue-100 text-blue-800';
      case Priority.HIGH:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Link href={`/clients/${dossier.clientId}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {dossier.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Réf:</span> {formatDossierId(dossier.id, dossier.reference)}
            </p>
            
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Type:</span> {dossier.type}
            </p>
            
            {dossier.client && dossier.client.contactInfo && (
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Client:</span> {dossier.client.contactInfo.firstName} {dossier.client.contactInfo.lastName}
              </p>
            )}
            
            {dossier.deadline && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Échéance:</span> {formatDate(dossier.deadline)}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 ${getStatusColor(dossier.status)}`}>
              {dossier.status}
            </span>
            
            <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 ${getPriorityColor(dossier.priority)}`}>
              {dossier.priority}
            </span>
            
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {dossier.workflowState}
            </span>
          </div>
        </div>
        
        {dossier.description && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2">
            {dossier.description}
          </p>
        )}
      </div>
    </Link>
  );
};