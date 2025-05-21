'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { 
  Mail, 
  FileText, 
  History, 
  MessageSquare, 
  Filter, 
  Calendar, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  User, 
  Users, 
  Clock,
  CheckCircle,
  FileCheck,
  RefreshCw,
  Clipboard,
  Filter as FilterIcon,
  DownloadCloud
} from 'lucide-react';

// Types pour notre modèle de données
type Communication = {
  id: string;
  type: 'message' | 'task' | 'notification' | 'action' | 'note';
  title: string;
  content: string;
  date: string;
  sender: string;
  recipient: string;
  dossierRef?: string;
  clientName?: string;
  clientId?: string;
  status: 'read' | 'unread' | 'completed' | 'pending' | 'archived';
  priority: 'high' | 'normal' | 'low';
  category?: string;
  tags?: string[];
};

export default function CommunicationPage() {
  // État pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [professionalFilter, setProfessionalFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour les communications
  const [communications, setCommunications] = useState<Communication[]>([]);
  
  // Charger les données
  useEffect(() => {
    // Simuler un chargement
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Données fictives pour la démonstration
      const mockData: Communication[] = [
        {
          id: 'comm-1',
          type: 'task',
          title: 'Vérification des documents fournis',
          content: 'Veuillez vérifier que tous les documents nécessaires ont été fournis par le client.',
          date: '2025-05-20T09:30:00Z',
          sender: 'Admin DTAHC',
          recipient: 'Julie Martin',
          dossierRef: 'DOSS-2025-042',
          clientName: 'Jean Dupont',
          clientId: 'client_8r81doh',
          status: 'pending',
          priority: 'high',
          category: 'Validation',
          tags: ['Documents', 'Urgent']
        },
        {
          id: 'comm-2',
          type: 'message',
          title: 'Question concernant le dossier',
          content: 'Le client a demandé des précisions sur les délais de traitement de son dossier.',
          date: '2025-05-19T14:15:00Z',
          sender: 'Support',
          recipient: 'Admin DTAHC',
          dossierRef: 'DOSS-2025-043',
          clientName: 'Marie Martin',
          clientId: 'client_9f72gtn',
          status: 'read',
          priority: 'normal',
          category: 'Question',
          tags: ['Délai', 'Suivi']
        },
        {
          id: 'comm-3',
          type: 'notification',
          title: 'Nouveau document ajouté',
          content: 'Un nouveau document a été ajouté au dossier par le client.',
          date: '2025-05-18T10:45:00Z',
          sender: 'Système',
          recipient: 'Admin DTAHC',
          dossierRef: 'DOSS-2025-042',
          clientName: 'Jean Dupont',
          clientId: 'client_8r81doh',
          status: 'unread',
          priority: 'normal',
          category: 'Document',
          tags: ['Nouveau', 'Document']
        },
        {
          id: 'comm-4',
          type: 'action',
          title: 'Relance client pour photos',
          content: 'Une relance a été effectuée auprès du client pour obtenir les photos manquantes.',
          date: '2025-05-17T16:20:00Z',
          sender: 'Julie Martin',
          recipient: 'Jean Dupont',
          dossierRef: 'DOSS-2025-042',
          clientName: 'Jean Dupont',
          clientId: 'client_8r81doh',
          status: 'completed',
          priority: 'normal',
          category: 'Relance',
          tags: ['Photos', 'Relance']
        },
        {
          id: 'comm-5',
          type: 'note',
          title: 'Note interne sur le dossier',
          content: 'Le client a mentionné qu\'il souhaite également rénover sa terrasse dans un second temps.',
          date: '2025-05-16T11:30:00Z',
          sender: 'Admin DTAHC',
          recipient: 'Équipe',
          dossierRef: 'DOSS-2025-044',
          clientName: 'Pierre Durand',
          clientId: 'client_3k45lmn',
          status: 'read',
          priority: 'low',
          category: 'Note',
          tags: ['Information', 'Futur projet']
        },
        {
          id: 'comm-6',
          type: 'task',
          title: 'Préparation du dossier pour dépôt',
          content: 'Préparer tous les documents nécessaires pour le dépôt du dossier en mairie.',
          date: '2025-05-15T09:00:00Z',
          sender: 'Admin DTAHC',
          recipient: 'Technique',
          dossierRef: 'DOSS-2025-045',
          clientName: 'Sophie Bernard',
          clientId: 'client_7h65jkl',
          status: 'completed',
          priority: 'high',
          category: 'Préparation',
          tags: ['Dépôt', 'Mairie']
        },
        {
          id: 'comm-7',
          type: 'message',
          title: 'Confirmation de réception',
          content: 'Nous confirmons la bonne réception de votre dossier complet.',
          date: '2025-05-14T14:45:00Z',
          sender: 'Support',
          recipient: 'client@example.com',
          dossierRef: 'DOSS-2025-046',
          clientName: 'Thomas Lefebvre',
          clientId: 'client_2p34qrs',
          status: 'read',
          priority: 'normal',
          category: 'Confirmation',
          tags: ['Réception', 'Confirmation']
        },
        {
          id: 'comm-8',
          type: 'task',
          title: 'Réalisation des plans',
          content: 'Réaliser les plans détaillés pour le projet d\'extension.',
          date: '2025-05-13T10:15:00Z',
          sender: 'Admin DTAHC',
          recipient: 'Dessinateur',
          dossierRef: 'DOSS-2025-047',
          clientName: 'Christine Moreau',
          clientId: 'client_5t67uvw',
          status: 'pending',
          priority: 'normal',
          category: 'Conception',
          tags: ['Plans', 'Extension']
        },
        {
          id: 'comm-9',
          type: 'notification',
          title: 'Retour mairie reçu',
          content: 'Le retour de la mairie concernant le dossier a été reçu.',
          date: '2025-05-12T16:30:00Z',
          sender: 'Système',
          recipient: 'Admin DTAHC',
          dossierRef: 'DOSS-2025-048',
          clientName: 'Michel Robert',
          clientId: 'client_1a23bcd',
          status: 'unread',
          priority: 'high',
          category: 'Mairie',
          tags: ['Retour', 'Mairie', 'Urgent']
        },
        {
          id: 'comm-10',
          type: 'action',
          title: 'Prise de contact avec client',
          content: 'Premier contact établi avec le client pour présentation des services.',
          date: '2025-05-11T11:00:00Z',
          sender: 'Julie Martin',
          recipient: 'Commercial',
          dossierRef: 'DOSS-2025-049',
          clientName: 'Isabelle Petit',
          clientId: 'client_4e56fgh',
          status: 'completed',
          priority: 'normal',
          category: 'Contact',
          tags: ['Premier contact', 'Présentation']
        }
      ];
      
      setCommunications(mockData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Filtrer les communications
  const filteredCommunications = communications.filter(comm => {
    // Recherche par terme
    if (searchTerm && !comm.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !comm.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !comm.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !comm.dossierRef?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtre par type
    if (typeFilter !== 'all' && comm.type !== typeFilter) {
      return false;
    }
    
    // Filtre par date
    if (dateFilter !== 'all') {
      const commDate = new Date(comm.date);
      const today = new Date();
      
      if (dateFilter === 'today' && 
          !(commDate.getDate() === today.getDate() && 
            commDate.getMonth() === today.getMonth() && 
            commDate.getFullYear() === today.getFullYear())) {
        return false;
      }
      
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (commDate < weekAgo) {
          return false;
        }
      }
      
      if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (commDate < monthAgo) {
          return false;
        }
      }
    }
    
    // Filtre par professionnel
    if (professionalFilter !== 'all' && comm.sender !== professionalFilter && comm.recipient !== professionalFilter) {
      return false;
    }
    
    // Filtre par statut
    if (statusFilter !== 'all' && comm.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Groupe de professionnels
  const professionals = ['Admin DTAHC', 'Julie Martin', 'Support', 'Technique', 'Commercial', 'Dessinateur'];
  
  // Fonction pour obtenir l'icône en fonction du type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Clipboard className="text-blue-500" size={20} />;
      case 'message':
        return <MessageSquare className="text-green-500" size={20} />;
      case 'notification':
        return <Mail className="text-amber-500" size={20} />;
      case 'action':
        return <FileCheck className="text-indigo-500" size={20} />;
      case 'note':
        return <FileText className="text-purple-500" size={20} />;
      default:
        return <MessageSquare className="text-gray-500" size={20} />;
    }
  };
  
  // Fonction pour gérer l'expansion d'un élément
  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  // Fonction pour obtenir la couleur en fonction de la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Lu</span>;
      case 'unread':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Non lu</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Terminé</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">En attente</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Archivé</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };
  
  return (
    <DashboardLayout activeMenu="communication">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Historique des Communications</h1>
            <p className="text-gray-600">Consultez et gérez toutes les communications et tâches</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm flex items-center gap-2">
              <DownloadCloud size={16} />
              <span>Exporter</span>
            </button>
            <Link 
              href="/communication/new" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Nouvelle communication
            </Link>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 ml-auto">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="task">Tâches</option>
                <option value="message">Messages</option>
                <option value="notification">Notifications</option>
                <option value="action">Actions</option>
                <option value="note">Notes</option>
              </select>
              
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              
              <button 
                className={`flex items-center px-3 py-2 border rounded-lg ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon size={16} className="mr-2" />
                <span>Filtres avancés</span>
                {showFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
              </button>
            </div>
          </div>
          
          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professionnel
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={professionalFilter}
                  onChange={(e) => setProfessionalFilter(e.target.value)}
                >
                  <option value="all">Tous les professionnels</option>
                  {professionals.map((prof, idx) => (
                    <option key={idx} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="read">Lu</option>
                  <option value="unread">Non lu</option>
                  <option value="completed">Terminé</option>
                  <option value="pending">En attente</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Liste des communications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Chargement des communications...</p>
            </div>
          ) : filteredCommunications.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={32} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Aucune communication ne correspond aux critères de recherche</p>
              <button 
                className="text-blue-600 hover:underline text-sm"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setDateFilter('all');
                  setProfessionalFilter('all');
                  setStatusFilter('all');
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCommunications.map((comm) => (
                <div 
                  key={comm.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${expandedItem === comm.id ? 'bg-blue-50' : ''}`}
                >
                  <div 
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => toggleExpand(comm.id)}
                  >
                    <div className="flex-shrink-0">
                      {getTypeIcon(comm.type)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-gray-800 font-medium flex items-center">
                            {comm.title}
                            {expandedItem === comm.id ? 
                              <ChevronDown size={16} className="ml-2 text-gray-500" /> : 
                              <ChevronRight size={16} className="ml-2 text-gray-500" />
                            }
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                            {comm.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(comm.priority)}`}></div>
                          {getStatusBadge(comm.status)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>De: {comm.sender}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>À: {comm.recipient}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(comm.date)}</span>
                        </div>
                        
                        {comm.dossierRef && (
                          <div className="flex items-center gap-1">
                            <FileText size={12} />
                            <span>{comm.dossierRef}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Détail expansé */}
                  {expandedItem === comm.id && (
                    <div className="mt-4 pl-8 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Détails</h4>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Type:</span> {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Client:</span> {comm.clientName || 'Non spécifié'}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Dossier:</span> {comm.dossierRef || 'Non spécifié'}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Priorité:</span> {
                                comm.priority === 'high' ? 'Haute' : 
                                comm.priority === 'normal' ? 'Normale' : 'Basse'
                              }
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Statut:</span> {
                                comm.status === 'read' ? 'Lu' :
                                comm.status === 'unread' ? 'Non lu' :
                                comm.status === 'completed' ? 'Terminé' :
                                comm.status === 'pending' ? 'En attente' : 'Archivé'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Message complet</h4>
                          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            {comm.content}
                          </p>
                          
                          {comm.tags && comm.tags.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-xs text-gray-500 mb-1">Tags:</h5>
                              <div className="flex flex-wrap gap-2">
                                {comm.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end space-x-2">
                            {comm.clientId && (
                              <Link 
                                href={`/clients/${comm.clientId}`} 
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                              >
                                Voir le client
                              </Link>
                            )}
                            
                            {comm.dossierRef && (
                              <Link 
                                href={`/dossiers/${comm.dossierRef}`} 
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                              >
                                Voir le dossier
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}