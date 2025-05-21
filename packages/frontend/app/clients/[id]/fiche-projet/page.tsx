'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Client } from '@dtahc/shared';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FicheClientOptimisee from '@/components/clients/FicheClientOptimisee';

export default function FicheProjetPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Récupérer les informations du client
      const fetchClient = async () => {
        setIsLoading(true);
        try {
          console.log('Fetching client with ID:', id);
          
          // Essayer d'abord de récupérer depuis localStorage pour éviter les problèmes avec l'API
          if (typeof window !== 'undefined') {
            try {
              const storedClients = localStorage.getItem('dtahc_clients');
              if (storedClients) {
                const clients = JSON.parse(storedClients);
                console.log(`Found ${clients.length} clients in localStorage, looking for ID:`, id);
                
                // Essayer différents formats d'ID possibles
                const originalId = id as string;
                const cleanId = originalId.replace('client_', '');
                const withPrefixId = originalId.startsWith('client_') ? originalId : `client_${originalId}`;
                
                const localClient = clients.find((c: any) => 
                  c.id === originalId || 
                  c.id === cleanId || 
                  c.id === withPrefixId
                );
                
                if (localClient) {
                  console.log('Found client directly in localStorage:', localClient);
                  setClient(localClient);
                  setIsLoading(false);
                  return; // On a trouvé le client localement, pas besoin d'aller plus loin
                }
              }
            } catch (e) {
              console.error('Error accessing localStorage:', e);
            }
          }
          
          // Si on n'a pas trouvé dans localStorage, essayer l'API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
          
          const response = await fetch(`/api/clients/${id}`, {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }).catch(error => {
            console.error('Erreur de fetch:', error);
            return null;
          });
          
          clearTimeout(timeoutId);
          
          if (!response || !response.ok) {
            const errorText = response ? await response.text().catch(() => 'Erreur inconnue') : 'Pas de réponse du serveur';
            console.error(`Erreur ${response?.status || 'réseau'}:`, errorText);
            throw new Error(`Erreur ${response?.status || 'réseau'} lors de la récupération du client: ${errorText}`);
          }
          
          const data = await response.json().catch(error => {
            console.error('Erreur lors du parsing JSON:', error);
            return null;
          });
          
          if (!data) {
            throw new Error('Données client invalides');
          }
          
          console.log('Client data fetched from API:', data);
          setClient(data);
          
          // Stocker le client dans localStorage pour la prochaine fois
          if (typeof window !== 'undefined' && data.id) {
            try {
              let storedClients = [];
              const storedClientsStr = localStorage.getItem('dtahc_clients');
              if (storedClientsStr) {
                storedClients = JSON.parse(storedClientsStr);
                // Remplacer ou ajouter le client
                const index = storedClients.findIndex((c: any) => c.id === data.id);
                if (index >= 0) {
                  storedClients[index] = data;
                } else {
                  storedClients.push(data);
                }
              } else {
                storedClients = [data];
              }
              localStorage.setItem('dtahc_clients', JSON.stringify(storedClients));
            } catch (e) {
              console.error('Error saving client to localStorage:', e);
            }
          }
        } catch (error) {
          console.error('Erreur complète:', error);
          // En cas d'erreur, utiliser des données fictives pour la démo
          setClient(undefined);
        } finally {
          setIsLoading(false);
        }
      };

      fetchClient();
    }
  }, [id]);

  const handleSaveProject = async (projectData: any) => {
    // Dans un cas réel, on enverrait ces données au serveur
    console.log('Données du projet à sauvegarder:', projectData);
    
    try {
      // Créer un dossier pour ce client avec les informations de la fiche projet
      const dossierData = {
        clientId: id,
        title: 'Projet ' + (client?.contactInfo?.firstName || '') + ' ' + (client?.contactInfo?.lastName || ''),
        description: projectData.natureTravaux ? Object.keys(projectData.natureTravaux).filter(key => projectData.natureTravaux[key]).join(', ') : 'Nouveau projet',
        type: 'DP', // Type de dossier par défaut
        status: 'NOUVEAU',
        priority: 'NORMAL',
        surfaceExistant: projectData.surfaceExistant || 0,
        surfaceProjet: projectData.surfaceProjet || 0,
        // Ajouter des informations simplifiées sous forme de chaînes de caractères plutôt que d'objets complexes
        hasDocuments: projectData.documents && projectData.documents.some(d => d.present) ? 'true' : 'false',
        documentCount: projectData.documents ? projectData.documents.filter(d => d.present).length : 0,
        documentsManquants: projectData.documentsManquants ? 'true' : 'false',
        adresseMemeProjet: projectData.adresseMemeProjet ? 'true' : 'false',
        natureTravaux: JSON.stringify(projectData.natureTravaux || {})
      };
      
      console.log('Données à envoyer au serveur:', dossierData);
      
      // Prévoir l'upload des fichiers si nécessaire
      if (projectData.documentFiles && projectData.documentFiles.length > 0) {
        console.log('Fichiers à télécharger:', projectData.documentFiles.map((f: any) => f?.name || 'Fichier sans nom'));
        
        try {
          // Stocker les documents dans localStorage pour simulation
          const documentStorage = {
            dossierId: `dossier_${Date.now()}`, // ID temporaire, sera remplacé plus tard
            clientId: id as string,
            files: projectData.documentFiles.map((file: any, index: number) => ({
              id: `doc_${Date.now()}_${index}`,
              name: file?.name || `Document ${index + 1}`,
              type: file?.type || 'application/octet-stream',
              size: file?.size || 0,
              uploadDate: new Date().toISOString()
            }))
          };
          
          // Sauvegarder dans localStorage
          const storedDocuments = localStorage.getItem('dtahc_documents') || '[]';
          const documents = JSON.parse(storedDocuments);
          documents.push(documentStorage);
          localStorage.setItem('dtahc_documents', JSON.stringify(documents));
          
          // Notifier l'utilisateur que les fichiers ont été correctement associés
          console.log("Documents sauvegardés en local pour simulation");
          
          // En mode développement, on simule juste l'envoi des fichiers
          // Dans un cas réel, on utiliserait FormData pour envoyer les fichiers au serveur
          /*
          const formData = new FormData();
          projectData.documentFiles.forEach((file, index) => {
            formData.append(`document_${index}`, file);
          });
          formData.append('dossierData', JSON.stringify(dossierData));
          
          // Appel API pour créer le dossier avec les fichiers
          const uploadResponse = await fetch('/api/documents/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Erreur lors de l'upload des fichiers: ${uploadResponse.status}`);
          }
          */
        } catch (uploadError) {
          console.error('Erreur lors du téléchargement des fichiers:', uploadError);
          // Continuer malgré l'erreur d'upload, pour au moins créer le dossier
        }
      }
      
      // Utilisation de AbortController pour limiter le temps d'attente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
      
      let response;
      try {
        // Créer des données simplifiées pour éviter les erreurs de sérialisation
        const simplifiedDossierData = {
          clientId: dossierData.clientId,
          title: dossierData.title,
          description: dossierData.description,
          type: dossierData.type,
          status: dossierData.status,
          priority: dossierData.priority,
          surfaceExistant: Number(dossierData.surfaceExistant) || 0,
          surfaceProjet: Number(dossierData.surfaceProjet) || 0,
          // Conversion sécurisée des valeurs booléennes en chaînes
          hasDocuments: dossierData.hasDocuments === 'true' || dossierData.hasDocuments === true,
          documentCount: Number(dossierData.documentCount) || 0,
          documentsManquants: dossierData.documentsManquants === 'true' || dossierData.documentsManquants === true,
          adresseMemeProjet: dossierData.adresseMemeProjet === 'true' || dossierData.adresseMemeProjet === true
        };
        
        // En développement local, simulons la création du dossier
        console.log('Simulation de création de dossier en mode développement');
        console.log('Données simplifiées du dossier:', simplifiedDossierData);
        
        // Stocker le dossier dans localStorage pour simulation
        const localDossiers = localStorage.getItem('dtahc_dossiers') || '[]';
        const dossiers = JSON.parse(localDossiers);
        
        // Générer un ID unique pour le dossier
        const dossierId = `dossier_${Date.now()}`;
        
        // Créer un nouveau dossier simulé avec les données simplifiées et les informations nécessaires pour le dashboard
        const newDossier = {
          id: dossierId,
          clientId: simplifiedDossierData.clientId,
          reference: `DOS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          title: simplifiedDossierData.title,
          description: simplifiedDossierData.description,
          type: simplifiedDossierData.type,
          status: simplifiedDossierData.status,
          priority: simplifiedDossierData.priority,
          surfaceExistant: simplifiedDossierData.surfaceExistant,
          surfaceProjet: simplifiedDossierData.surfaceProjet,
          hasDocuments: simplifiedDossierData.hasDocuments,
          documentCount: simplifiedDossierData.documentCount,
          documentsManquants: simplifiedDossierData.documentsManquants,
          adresseMemeProjet: simplifiedDossierData.adresseMemeProjet,
          // Ajout des champs nécessaires pour le dashboard
          workflowState: 'INITIAL',
          client: client, // Inclure l'objet client complet pour le dashboard
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Ajouter le nouveau dossier à la liste
        dossiers.push(newDossier);
        
        // Sauvegarder la liste mise à jour dans localStorage
        localStorage.setItem('dtahc_dossiers', JSON.stringify(dossiers));
        
        // Mettre à jour les documents stockés avec l'ID du dossier
        try {
          const storedDocuments = localStorage.getItem('dtahc_documents') || '[]';
          const documents = JSON.parse(storedDocuments);
          
          // Mettre à jour l'ID du dossier pour les documents récemment ajoutés
          const updatedDocuments = documents.map((docStorage: any) => {
            if (docStorage.clientId === id && docStorage.dossierId.startsWith('dossier_')) {
              return { ...docStorage, dossierId };
            }
            return docStorage;
          });
          
          localStorage.setItem('dtahc_documents', JSON.stringify(updatedDocuments));
        } catch (docError) {
          console.error('Erreur lors de la mise à jour des documents:', docError);
        }
        
        // Déclencher l'événement de mise à jour du stockage de dossiers
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('dossierStorageUpdated', { 
            detail: { dossierId: newDossier.id, action: 'create' } 
          });
          window.dispatchEvent(event);
          console.log('Déclencher l\'event dossierStorageUpdated pour Dashboard:', newDossier.id);
        }
        
        // Simuler un délai et une réponse réussie
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Créer une réponse simulée
        response = {
          ok: true,
          json: async () => ({ id: newDossier.id }),
          text: async () => JSON.stringify({ id: newDossier.id })
        };
      } catch (localError) {
        console.error('Erreur lors de la simulation locale:', localError);
        
        // En cas d'erreur locale, essayer l'API réelle avec des données simplifiées
        try {
          // Créer des données simplifiées pour l'API
          const apiDossierData = {
            clientId: dossierData.clientId,
            title: dossierData.title,
            description: dossierData.description,
            type: dossierData.type,
            status: dossierData.status,
            priority: dossierData.priority,
            surfaceExistant: Number(dossierData.surfaceExistant) || 0,
            surfaceProjet: Number(dossierData.surfaceProjet) || 0
          };
          
          console.log('Essai API avec données simplifiées:', apiDossierData);
          
          // Appel API pour créer le dossier
          response = await fetch('/api/dossiers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            body: JSON.stringify(apiDossierData),
            signal: controller.signal
          });
        } catch (apiError) {
          console.error('Erreur de fetch lors de la création du dossier:', apiError);
          response = null;
        }
      }
      
      clearTimeout(timeoutId);
      
      if (!response || !response.ok) {
        const errorText = response ? await response.text().catch(() => 'Erreur inconnue') : 'Pas de réponse du serveur';
        console.error(`Erreur ${response?.status || 'réseau'}:`, errorText);
        throw new Error(`Erreur ${response?.status || 'réseau'} lors de la création du dossier: ${errorText}`);
      }
      
      // Notifier explicitement tous les composants qui écoutent l'événement dossierStorageUpdated
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dossierStorageUpdated'));
      }
      
      // Rediriger vers le dashboard avec un paramètre de mise en surbrillance
      router.push(`/dashboard?highlight=${newDossier.id}`);
      // Alternativement, rediriger vers la page client si préféré
      // router.push(`/clients/${id}?created=true`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      // Afficher une notification d'erreur à l'utilisateur
      alert("Une erreur est survenue lors de l'enregistrement du dossier. Les fichiers ont été conservés mais le dossier n'a pas pu être créé.");
    }
  };

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
      <FicheClientOptimisee client={client} onSave={handleSaveProject} />
    </DashboardLayout>
  );
}