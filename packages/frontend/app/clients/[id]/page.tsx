'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Client, Dossier, DossierStatus, WorkflowState, Priority, FormType } from '@dtahc/shared';
import { DossierCard } from '@/components/dossiers/DossierCard';
import {
  User, Search, Filter, Eye, Download, Edit, Trash2, 
  MessageSquare, FileText, Phone, Mail, MapPin, 
  Building, ChevronRight, ChevronDown, Plus, CheckCircle,
  AlertCircle, Calendar, Clock, CheckSquare, MessageCircle, 
  List, RefreshCw
} from 'lucide-react';
import { 
  StatusBadge, DossierItem, DocumentItem, TaskItem, 
  formatClientData, formatDossiers 
} from '@/components/clients/ClientDetailComponents';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [client, setClient] = useState<Client | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatedNotification, setShowCreatedNotification] = useState(false);
  const [generatingFormLink, setGeneratingFormLink] = useState(false);
  const [formLinkData, setFormLinkData] = useState<{ formUrl: string } | null>(null);
  
  // États pour la nouvelle interface
  const [activeTab, setActiveTab] = useState('infos');
  const [documentFilter, setDocumentFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  
  // État pour les formulaires
  const [newTask, setNewTask] = useState({
    titre: '',
    description: '',
    assignee: 'Admin',
    deadline: new Date().toISOString().split('T')[0]
  });
  const [newNote, setNewNote] = useState('');
  
  // Tâches et historique
  const [taches, setTaches] = useState([
    {
      id: 'TASK-001',
      titre: 'Relancer le client pour photos',
      assignee: 'Admin',
      statut: 'En cours',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      dateCreation: new Date().toLocaleDateString('fr-FR')
    },
    {
      id: 'TASK-002',
      titre: 'Vérifier les documents fournis',
      assignee: 'Admin',
      statut: 'En attente',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      dateCreation: new Date().toLocaleDateString('fr-FR')
    }
  ]);
  
  const [historique, setHistorique] = useState([
    { 
      date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'), 
      action: 'Création fiche client', 
      type: 'action',
      utilisateur: 'Admin', 
      details: 'Enregistrement initial des informations client' 
    },
    { 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'), 
      action: 'Note interne ajoutée', 
      type: 'note',
      utilisateur: 'Admin', 
      details: 'Client contacté par téléphone' 
    }
  ]);
  
  // Fonction pour générer un lien de formulaire de projet
  const generateProjectFormLink = async () => {
    if (!id) return;
    
    try {
      setGeneratingFormLink(true);
      
      const response = await fetch(`/api/clients/${id}/generate-form-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formType: FormType.PROJECT_FORM }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien de formulaire');
      }
      
      const data = await response.json();
      console.log('Lien de formulaire généré:', data);
      
      // Mettre à jour les données du client pour refléter le nouveau lien
      setFormLinkData(data);
      
      // Recharger les données du client pour afficher le nouveau lien
      await fetchClientData();
      
    } catch (error) {
      console.error('Erreur lors de la génération du lien de formulaire:', error);
      alert('Une erreur est survenue lors de la génération du lien de formulaire.');
    } finally {
      setGeneratingFormLink(false);
    }
  };

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      // Import dynamique pour éviter les problèmes de SSR
      const { getClientById } = await import('@/lib/api/clients');
      
      // Récupérer les informations du client
      const clientResponse = await getClientById(id as string);
      if (clientResponse && clientResponse.data) {
        setClient(clientResponse.data);
        
        // Récupérer les dossiers du client (si disponibles)
        if (clientResponse.data.dossiers) {
          setDossiers(clientResponse.data.dossiers);
        } else {
          // Fallback à l'API pour les dossiers si nécessaire
          try {
            const dossiersResponse = await fetch(`/api/clients/${id}/dossiers`, {
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              },
              cache: 'no-store',
            });
            
            if (dossiersResponse.ok) {
              const dossiersData = await dossiersResponse.json();
              setDossiers(dossiersData);
            }
          } catch (dossierError) {
            console.error('Erreur lors de la récupération des dossiers:', dossierError);
            // Utiliser un tableau vide si l'API n'est pas disponible
            setDossiers([]);
          }
        }
      } else {
        throw new Error('Aucune donnée client reçue');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les données du client et ses dossiers
  useEffect(() => {
    if (id) {
      fetchClientData();
      
      // Vérifier si un dossier vient d'être créé
      const created = searchParams.get('created');
      if (created === 'true') {
        setShowCreatedNotification(true);
        // Masquer la notification après 5 secondes
        setTimeout(() => {
          setShowCreatedNotification(false);
        }, 5000);
      }
    }
  }, [id, searchParams]);
  
  // Écouter les événements de mise à jour des dossiers
  useEffect(() => {
    // Protection contre le SSR (exécuter uniquement côté client)
    if (typeof window === 'undefined') return;
    
    const handleDossierUpdated = () => {
      console.log('ClientDetailPage: dossierStorageUpdated event received');
      if (id) {
        fetchClientData();
      }
    };
    
    // Seulement écouter les mises à jour spécifiques, pas les focus pour éviter les boucles infinies
    window.addEventListener('dossierStorageUpdated', handleDossierUpdated);
    
    return () => {
      window.removeEventListener('dossierStorageUpdated', handleDossierUpdated);
    };
  }, [id]);

  // Gestionnaires pour les formulaires
  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implémenter la création de tâche avec l'API
    console.log('Création de tâche:', newTask);
    setShowNewTaskForm(false);
    
    // Simuler l'ajout d'une tâche (à remplacer par l'appel API)
    const newTaskItem = {
      id: `TASK-${Date.now()}`,
      titre: newTask.titre,
      description: newTask.description,
      assignee: newTask.assignee,
      statut: 'En cours',
      deadline: new Date(newTask.deadline).toLocaleDateString('fr-FR'),
      dateCreation: new Date().toLocaleDateString('fr-FR')
    };
    
    setTaches([newTaskItem, ...taches]);
    
    // Réinitialiser le formulaire
    setNewTask({
      titre: '',
      description: '',
      assignee: 'Admin',
      deadline: new Date().toISOString().split('T')[0]
    });
  };
  
  const handleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implémenter la création de note avec l'API
    console.log('Création de note:', newNote);
    setShowNewNoteForm(false);
    
    // Simuler l'ajout d'une note (à remplacer par l'appel API)
    const newNoteItem = {
      date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'),
      action: 'Note interne ajoutée',
      type: 'note',
      utilisateur: 'Admin',
      details: newNote
    };
    
    setHistorique([newNoteItem, ...historique]);
    
    // Réinitialiser le formulaire
    setNewNote('');
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

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Client non trouvé.</p>
          <Link 
            href="/clients" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Retour à la liste des clients
          </Link>
        </div>
      </div>
    );
  }

  // Formatage des données client pour l'affichage
  const clientData = formatClientData(client);

  // Formatage des dossiers pour affichage
  const formattedDossiers = formatDossiers(dossiers, clientData?.adresse || '');

  // Documents fictifs (à remplacer par des données réelles quand disponibles)
  const documents = [
    { 
      id: 1,
      nom: 'Pièce d\'identité', 
      type: 'PDF', 
      date: new Date().toLocaleDateString('fr-FR'), 
      taille: '1.2 MB', 
      categorie: 'Document client' 
    },
    { 
      id: 2,
      nom: 'Justificatif de domicile', 
      type: 'PDF', 
      date: new Date().toLocaleDateString('fr-FR'), 
      taille: '843 KB', 
      categorie: 'Document client' 
    },
    { 
      id: 3,
      nom: 'Photos façade actuelle', 
      type: 'JPG', 
      date: new Date().toLocaleDateString('fr-FR'), 
      taille: '3.5 MB', 
      categorie: 'Dossier urbanisme' 
    }
  ];

  // Facturation fictive (à remplacer par des données réelles quand disponibles)
  const facturation = [
    { 
      id: 1,
      type: 'Devis', 
      reference: `DEV-${new Date().getFullYear()}-001`, 
      montant: '950.00 €', 
      date: new Date().toLocaleDateString('fr-FR'),
      mois: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      statut: 'Accepté' 
    },
    { 
      id: 2,
      type: 'Facture Acompte', 
      reference: `FAC-${new Date().getFullYear()}-001`, 
      montant: '285.00 €', 
      date: new Date().toLocaleDateString('fr-FR'),
      mois: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      statut: 'En attente' 
    }
  ];

  // Gestion des tâches est déjà définie ci-dessus

  // Historique est déjà défini ci-dessus

  // Options pour les filtres
  const categories = ['Document client', 'Dossier urbanisme', 'Courrier mairie', 'Réglementation', 'Autres'];
  const membres = ['Admin', 'Support', 'Technique', 'Commercial'];
  const mois = ['01/2023', '02/2023', '03/2023', '04/2023', '05/2023', '06/2023', '07/2023', '08/2023', '09/2023', '10/2023', '11/2023', '12/2023'];
  const statuts = {
    dossiers: ['TOUS', 'TOP URGENT', 'ATTENTE PIÈCE', 'EN COURS', 'TERMINÉ'],
    facturation: ['TOUS', 'En attente', 'Payé', 'Accepté', 'Refusé']
  };

  // Filtrage des documents
  const filteredDocuments = documentFilter 
    ? documents.filter(doc => doc.categorie === documentFilter) 
    : documents;
  
  // Définir une interface pour le dossier formaté
  interface FormattedDossier {
    id: string;
    reference: string;
    titre: string;
    statut: string;
    mois: string;
    dateCreation: string;
    adresse: string;
    progression: number;
    priorite: string;
    [key: string]: any; // Pour les autres propriétés possibles
  }

  // Filtrage des dossiers
  const filteredDossiers = formattedDossiers.filter((dossier: FormattedDossier) => {
    if (selectedMonth && dossier.mois !== selectedMonth) return false;
    if (selectedStatus && selectedStatus !== 'TOUS' && dossier.statut !== selectedStatus) return false;
    return true;
  });
  
  // Interface pour les items de facturation
  interface FacturationItem {
    id: number;
    reference: string;
    type: string;
    montant: string;
    statut: string;
    mois: string;
    date: string;
    [key: string]: any;
  }

  // Filtrage de la facturation
  const filteredFacturation = facturation.filter((item: FacturationItem) => {
    if (selectedMonth && item.mois !== selectedMonth) return false;
    if (selectedStatus && selectedStatus !== 'TOUS' && item.statut !== selectedStatus) return false;
    return true;
  });

  // Calcul des totaux financiers
  const totalMontant = facturation.reduce((sum, item: FacturationItem) => sum + parseFloat(item.montant), 0);
  const totalPaye = facturation
    .filter((item: FacturationItem) => item.statut === 'Payé')
    .reduce((sum, item: FacturationItem) => sum + parseFloat(item.montant), 0);
  const totalRestant = totalMontant - totalPaye;

  return (
    <div className="bg-gray-50 min-h-screen">
      {showCreatedNotification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 flex justify-between items-center" role="alert">
          <div>
            <span className="font-bold">Succès!</span>
            <span className="block sm:inline"> Le dossier a été créé avec succès.</span>
          </div>
          <button 
            onClick={() => setShowCreatedNotification(false)}
            className="text-green-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* En-tête */}
      <div className="flex justify-between items-center p-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/clients" className="text-blue-600 hover:text-blue-800">Clients</Link>
            <ChevronRight size={16} />
            <span className="text-blue-500">Fiche détaillée</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            {clientData?.nom || 'Client'}
            <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              {clientData?.id || ''}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Envoyer un message</span>
          </button>
          <Link 
            href={`/clients/${client.id}/edit`}
            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
          >
            <Edit size={16} />
            <span>Modifier</span>
          </Link>
        </div>
      </div>
      
      {/* Informations principales */}
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
                {clientData?.nom?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{clientData?.nom || 'Client'}</h2>
                <p className="text-gray-500">{clientData?.type || 'N/A'} • Créé le {clientData?.creation || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100 min-w-[120px]">
                <span className="text-sm text-green-600 font-medium">Dossiers</span>
                <span className="text-2xl font-semibold text-green-700">{formattedDossiers.length}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-100 min-w-[120px]">
                <span className="text-sm text-blue-600 font-medium">Documents</span>
                <span className="text-2xl font-semibold text-blue-700">{documents.length}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100 min-w-[120px]">
                <span className="text-sm text-purple-600 font-medium">Factures</span>
                <span className="text-2xl font-semibold text-purple-700">{facturation.length}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm uppercase font-semibold text-gray-500 mb-3 border-b pb-2">Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{clientData?.email || 'Email non renseigné'}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{clientData?.telephone || 'Téléphone non renseigné'}</span>
                </div>
                <div className="flex items-start">
                  <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-600">{clientData?.adresse || 'Adresse non renseignée'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm uppercase font-semibold text-gray-500 mb-3 border-b pb-2">Informations complémentaires</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Building size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Pro associé: {clientData?.pro || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Date de création: {clientData?.creation || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Dernier contact: {clientData?.dernierContact || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'infos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('infos')}
              >
                Résumé
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'dossiers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('dossiers')}
              >
                Dossiers
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'facturation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('facturation')}
              >
                Facturation
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'historique' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('historique')}
              >
                Historique
              </button>
            </nav>
          </div>
          
          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Résumé */}
            {activeTab === 'infos' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Dossiers récents</h3>
                    <div className="flex gap-2">
                      <select 
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-600"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        <option value="">Tous les mois</option>
                        {mois.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => setActiveTab('dossiers')}>
                        Voir tous
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredDossiers.length > 0 ? (
                      filteredDossiers.map((dossier: FormattedDossier) => (
                        <DossierItem key={dossier.id} dossier={dossier} />
                      ))
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500">Aucun dossier disponible</p>
                        <Link 
                          href={`/clients/${client.id}/fiche-projet`}
                          className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                        >
                          Créer un dossier
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Documents récents</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => setActiveTab('documents')}>
                      Voir tous
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {documents.length > 0 ? (
                      documents.slice(0, 3).map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 bg-blue-50 text-blue-600 rounded">
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{doc.nom}</p>
                              <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
                              <Eye size={16} />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500">Aucun document disponible</p>
                      </div>
                    )}
                    
                    <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2">
                      <Plus size={16} />
                      <span>Ajouter un document</span>
                    </button>
                  </div>
                  
                  {/* Tâches récentes */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Tâches récentes</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => setActiveTab('historique')}>
                        Voir toutes
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {taches.length > 0 ? (
                        taches.slice(0, 2).map((tache, index) => (
                          <TaskItem key={index} task={tache} />
                        ))
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-gray-500">Aucune tâche disponible</p>
                        </div>
                      )}
                      <button 
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                        onClick={() => setShowNewTaskForm(true)}
                      >
                        <Plus size={16} />
                        <span>Ajouter une tâche</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dossiers */}
            {activeTab === 'dossiers' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Liste des dossiers</h3>
                  <Link 
                    href={`/clients/${client.id}/fiche-projet`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    <span>Nouveau dossier</span>
                  </Link>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un dossier..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Tous les mois</option>
                    {mois.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Tous les statuts</option>
                    {statuts.dossiers.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                {formattedDossiers.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étape</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDossiers.map((dossier: FormattedDossier) => (
                          <tr key={dossier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{dossier.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{dossier.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{dossier.etape}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={dossier.statut} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{dossier.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link href={`/dossiers/${dossier.id}`} className="text-blue-600 hover:text-blue-800">
                                  <Eye size={18} />
                                </Link>
                                <Link href={`/dossiers/${dossier.id}/edit`} className="text-gray-600 hover:text-gray-800">
                                  <Edit size={18} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">Aucun dossier trouvé pour ce client.</p>
                    <Link 
                      href={`/clients/${client.id}/fiche-projet`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Créer un nouveau dossier
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Documents */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Documents client</h3>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-700">
                    <Plus size={16} />
                    <span>Ajouter des documents</span>
                  </button>
                </div>
                
                <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                  <div className="relative w-64">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500">Filtrer par:</span>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                      value={documentFilter}
                      onChange={(e) => setDocumentFilter(e.target.value)}
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Étiquettes de filtrage rapide */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-1 rounded-full text-sm ${documentFilter === '' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setDocumentFilter('')}
                  >
                    Tous
                  </button>
                  {categories.map((cat, index) => (
                    <button 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${documentFilter === cat ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => setDocumentFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc, index) => (
                      <DocumentItem key={doc.id} document={doc} />
                    ))}
                    
                    <div className="border border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[150px] hover:border-blue-300 cursor-pointer group">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-100">
                          <Plus size={24} />
                        </div>
                        <p className="text-sm text-gray-500 group-hover:text-blue-600">Ajouter un document</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">Aucun document trouvé pour ce client.</p>
                    <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                      Ajouter un document
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Facturation */}
            {activeTab === 'facturation' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Documents financiers</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-50">
                      <Plus size={16} />
                      <span>Créer un devis</span>
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-700">
                      <Plus size={16} />
                      <span>Créer une facture</span>
                    </button>
                  </div>
                </div>
                
                {/* Filtres de facturation */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Tous les mois</option>
                    {mois.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Tous les statuts</option>
                    {statuts.facturation.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                {facturation.length > 0 ? (
                  <>
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredFacturation.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{item.reference}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.montant}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={item.statut} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Eye size={18} />
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-800">
                                    <Download size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Résumé financier</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Montant total</p>
                          <p className="text-lg font-semibold text-gray-800">{totalMontant.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Acompte versé</p>
                          <p className="text-lg font-semibold text-green-600">{totalPaye.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Solde restant</p>
                          <p className="text-lg font-semibold text-amber-600">{totalRestant.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">État paiement</p>
                          <p className="text-sm font-medium mt-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              {totalPaye > 0 ? 'Acompte versé' : 'En attente de paiement'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">Aucun document financier trouvé pour ce client.</p>
                    <div className="flex justify-center gap-2">
                      <button className="inline-block border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 py-2 px-4 rounded-md">
                        Créer un devis
                      </button>
                      <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                        Créer une facture
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Historique */}
            {activeTab === 'historique' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Historique des actions</h3>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1.5 border border-gray-200 bg-blue-50 text-blue-600 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-100"
                      onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                    >
                      <MessageCircle size={16} />
                      <span>Ajouter une note</span>
                    </button>
                    <button 
                      className="px-3 py-1.5 border border-gray-200 bg-green-50 text-green-600 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-green-100"
                      onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                    >
                      <CheckSquare size={16} />
                      <span>Créer une tâche</span>
                    </button>
                  </div>
                </div>
                
                {/* Formulaire d'ajout de note */}
                {showNewNoteForm && (
                  <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="text-sm font-medium text-blue-700 mb-3">Ajouter une note interne</h4>
                    <form onSubmit={handleNoteSubmit}>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3" 
                        rows={3}
                        placeholder="Saisir votre note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        required
                      ></textarea>
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button"
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600"
                          onClick={() => setShowNewNoteForm(false)}
                        >
                          Annuler
                        </button>
                        <button 
                          type="submit"
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Formulaire d'ajout de tâche */}
                {showNewTaskForm && (
                  <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="text-sm font-medium text-green-700 mb-3">Créer une nouvelle tâche</h4>
                    <form onSubmit={handleTaskSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Titre de la tâche</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newTask.titre}
                          onChange={(e) => setNewTask({...newTask, titre: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          rows={2}
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1">Assignée à</label>
                          <select 
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newTask.assignee}
                            onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                          >
                            {membres.map((membre, index) => (
                              <option key={index} value={membre}>{membre}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Date d'échéance</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newTask.deadline}
                            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button"
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600"
                          onClick={() => setShowNewTaskForm(false)}
                        >
                          Annuler
                        </button>
                        <button 
                          type="submit"
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md"
                        >
                          Créer la tâche
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Filtres et vues pour l'historique */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="flex text-sm bg-gray-100 rounded-lg overflow-hidden">
                    <button className="px-4 py-2 bg-blue-600 text-white">Tout</button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-200">Actions</button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-200">Notes</button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-200">Tâches</button>
                  </div>
                </div>
                
                {/* Liste des tâches */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                    <CheckSquare size={16} />
                    <span>Tâches en cours</span>
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {taches.length > 0 ? (
                      taches.filter(t => t.statut !== 'Terminée').map((tache, index) => (
                        <TaskItem key={index} task={tache} />
                      ))
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500">Aucune tâche en cours</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {historique.length > 0 ? (
                  <div className="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                    {historique.map((item, index) => (
                      <div key={index} className="relative pb-6">
                        <div className={`absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-white border-2 ${
                          item.type === 'note' ? 'border-blue-500' : 
                          item.type === 'tache' ? 'border-green-500' : 
                          'border-gray-500'
                        }`}></div>
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <div className={`bg-white border rounded-lg p-4 shadow-sm ${
                          item.type === 'note' ? 'border-blue-200 bg-blue-50' : 
                          item.type === 'tache' ? 'border-green-200 bg-green-50' : 
                          'border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {item.type === 'note' && <MessageCircle size={16} className="text-blue-600" />}
                            {item.type === 'tache' && <CheckSquare size={16} className="text-green-600" />}
                            {item.type === 'action' && <List size={16} className="text-gray-600" />}
                            <p className="font-medium text-gray-800">{item.action}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                          <p className="text-xs text-gray-500">Par: {item.utilisateur}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-2">Aucun historique disponible</p>
                    <p className="text-sm text-gray-400">Les actions effectuées sur ce client apparaîtront ici</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Section pour générer et afficher le lien de formulaire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Inviter le client à remplir une fiche projet</h2>
          
          {formLinkData ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="mb-2 font-medium text-blue-800">Lien de formulaire généré avec succès!</p>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="text" 
                  value={formLinkData.formUrl} 
                  readOnly 
                  className="flex-1 p-2 border border-blue-300 rounded bg-white text-sm" 
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formLinkData.formUrl);
                    alert('Lien copié dans le presse-papier!');
                  }}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-blue-600">
                Envoyez ce lien au client pour qu'il remplisse sa fiche projet. Ce lien est valable pendant 7 jours.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="mb-2 text-gray-700">
                Générez un lien à envoyer au client pour qu'il puisse remplir sa fiche projet en ligne.
              </p>
            </div>
          )}
          
          <button 
            onClick={generateProjectFormLink}
            disabled={generatingFormLink}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              generatingFormLink 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {generatingFormLink ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Générer un lien de formulaire</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}