'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, User, Phone, Mail, Home, Calendar, FileText, Clock, Upload, Camera } from 'lucide-react';

export default function ProjectConfirmationPage() {
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isInternalUser, setIsInternalUser] = useState<boolean>(false);
  const [dossierInfo, setDossierInfo] = useState<any>(null);
  const [submissionDate, setSubmissionDate] = useState<string>('');
  const [documentsInfo, setDocumentsInfo] = useState<any>(null);

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window !== 'undefined') {
      // Récupérer l'ID du dossier créé (si disponible)
      const lastDossierId = localStorage.getItem('lastCreatedDossierId');
      const lastClientId = localStorage.getItem('lastCreatedClientId');
      setDossierId(lastDossierId);
      setClientId(lastClientId);
      
      // Définir la date de soumission
      setSubmissionDate(new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));

      // Vérifier si l'utilisateur est un utilisateur interne (admin, etc.)
      // Pour ce prototype, nous utilisons une simple vérification en localStorage
      // Dans un environnement réel, cela serait basé sur l'authentification
      const userType = localStorage.getItem('userType') || '';
      setIsInternalUser(userType === 'admin' || userType === 'internal');
      
      // Récupérer les données du dossier si disponible
      if (lastDossierId) {
        try {
          const storedDossiers = localStorage.getItem('dtahc_dossiers');
          if (storedDossiers) {
            const dossiers = JSON.parse(storedDossiers);
            const dossier = dossiers.find((d: any) => d.id === lastDossierId);
            if (dossier) {
              setDossierInfo(dossier);
            }
          }
        } catch (e) {
          console.error('Erreur lors de la récupération des informations du dossier:', e);
        }
      }
      
      // Récupérer les informations sur les documents soumis
      try {
        const storedDocumentsInfo = localStorage.getItem('lastUploadedDocuments');
        if (storedDocumentsInfo) {
          setDocumentsInfo(JSON.parse(storedDocumentsInfo));
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des informations sur les documents:', e);
      }
    }
  }, []);

  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-green-600 text-white text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Fiche projet complétée !</h1>
          <p className="mt-2 text-white text-opacity-90">
            Votre dossier a été enregistré le {submissionDate}
          </p>
        </div>
        
        <div className="p-6 text-center">
          <p className="mb-6">
            Merci d'avoir complété votre fiche projet. Vos informations ont été enregistrées avec succès.
          </p>
          
          {/* Numéro de dossier et référence */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-blue-800">Numéro de dossier:</span>
              <span className="text-blue-700">{dossierInfo?.reference || "En cours d'attribution"}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-blue-800">Type de projet:</span>
              <span className="text-blue-700">{dossierInfo?.type || "Non spécifié"}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-blue-800">Statut actuel:</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                En attente de traitement
              </span>
            </div>
          </div>
          
          {/* Détails du projet en résumé */}
          {dossierInfo && (
            <div className="border rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-gray-600" />
                Résumé de votre projet
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-700 font-medium">Date de soumission:</span>
                    <span className="text-gray-600 ml-2">{submissionDate}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Home size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-700 font-medium">Adresse du projet:</span>
                    <span className="text-gray-600 ml-2">
                      {dossierInfo.projectAddress ? 
                        `${dossierInfo.projectAddress.street}, ${dossierInfo.projectAddress.zipCode} ${dossierInfo.projectAddress.city}` : 
                        "Même adresse que le client"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-700 font-medium">Délai estimé de traitement:</span>
                    <span className="text-gray-600 ml-2">7 à 10 jours ouvrés</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Résumé des documents soumis */}
          {documentsInfo && (
            <div className="border rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Upload size={16} className="text-gray-600" />
                Documents soumis
              </h3>
              
              <div className="space-y-2 text-sm">
                <ul className="divide-y divide-gray-100">
                  {documentsInfo.photoPres && (
                    <li className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera size={16} className="text-green-500" />
                        <span>Photo de près</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Téléchargé</span>
                    </li>
                  )}
                  
                  {documentsInfo.photoLoin && (
                    <li className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera size={16} className="text-green-500" />
                        <span>Photo de loin</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Téléchargé</span>
                    </li>
                  )}
                  
                  {documentsInfo.croquis && (
                    <li className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-500" />
                        <span>Croquis ou plan</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Téléchargé</span>
                    </li>
                  )}
                  
                  {documentsInfo.documents && (
                    <li className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-500" />
                        <span>Autres documents</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Téléchargé</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          <p className="mb-6">
            Notre équipe va étudier votre dossier et vous contactera très prochainement.
          </p>
          
          {/* Afficher des liens supplémentaires pour les utilisateurs internes */}
          {isInternalUser && dossierId && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-700 mb-3">Actions pour l'équipe interne :</p>
              <div className="flex flex-col gap-2">
                <Link 
                  href={`/dashboard?highlight=${dossierId}`} 
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  <span>Voir sur le tableau de bord</span>
                  <ArrowRight size={16} />
                </Link>
                
                {clientId && (
                  <Link 
                    href={`/clients/${clientId}/fiche-administrative`} 
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    <span>Remplir fiche administrative</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
                
                <Link 
                  href={`/clients`} 
                  className="flex items-center justify-center gap-2 bg-white border border-blue-300 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50"
                >
                  <span>Liste des clients</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
          
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-2">
              Pour toute question, n'hésitez pas à nous contacter :
            </p>
            <p className="text-sm text-gray-500">
              <a href="mailto:contact@autorisations.fr" className="text-blue-600 hover:underline">
                contact@autorisations.fr
              </a> | 
              <a href="tel:+33123456789" className="text-blue-600 hover:underline ml-1">
                01 23 45 67 89
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}