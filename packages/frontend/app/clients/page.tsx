'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Client, ClientType, AddressType } from '@dtahc/shared';
import { formatClientId } from '@/utils/formatters';
import { 
  Search, Filter, Plus, ChevronDown, ChevronRight, 
  Download, Users, User, Mail, Phone, MapPin, Building,
  Eye, Edit, FileText, Check, X, AlertCircle, Clock,
  Calendar, DollarSign, PlusCircle, CheckCircle, List,
  ArrowUpRight, Home, BarChart2, LayoutDashboard, Database,
  Settings, MessageSquare, Trash2
} from 'lucide-react';
import { useFormLinks } from '@/hooks/useFormLinks';
import FormLinkIndicator from '@/components/clients/FormLinkIndicator';
import ClientListRow from '@/components/clients/ClientListRow';
import ClientExpandedRow from '@/components/clients/ClientExpandedRow';

export default function ClientsPage() {
  // États
  const [clients, setClients] = useState<MockClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  
  const { resendFormLink, isResendingLink } = useFormLinks();
  
  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        
        // Utiliser notre service client au lieu de fetch direct
        const { getClients } = await import('@/lib/api/clients');
        const result = await getClients();
        
        if (result && result.data) {
          setClients(result.data);
          console.log('Clients chargés:', result.data.length);
        } else {
          throw new Error('Aucune donnée de client reçue');
        }
      } catch (error) {
        console.error('Erreur:', error);
        // En cas d'erreur, utiliser des données de démonstration
        setClients(mockClients as MockClient[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
    
    // Ajouter un écouteur pour les mises à jour de clients
    const handleClientUpdated = () => {
      console.log('Événement de mise à jour client détecté');
      fetchClients();
    };
    
    // S'abonner à l'événement de mise à jour
    if (typeof window !== 'undefined') {
      window.addEventListener('clientStorageUpdated', handleClientUpdated);
      window.addEventListener('dossierStorageUpdated', handleClientUpdated);
    }
    
    // Nettoyer l'écouteur lors du démontage
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('clientStorageUpdated', handleClientUpdated);
        window.removeEventListener('dossierStorageUpdated', handleClientUpdated);
      }
    };
  }, []);

  // Statistiques
  const stats = {
    totalClients: clients.length,
    actifs: clients.filter(c => c.status === 'ACTIF').length,
    prospects: clients.filter(c => c.status === 'PROSPECT').length,
    inactifs: clients.filter(c => c.status === 'INACTIF').length,
    nouveauxCeMois: clients.filter(c => {
      if (!c.createdAt) return false;
      const createdAt = new Date(c.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
    dossiersMoyenneParClient: clients.length > 0 
      ? clients.reduce((acc, client) => acc + (client.dossiers?.length || 0), 0) / clients.length
      : 0,
    conversionProspects: 68
  };

  // Filtrer les clients
  const getFilteredClients = () => {
    return clients.filter(client => {
      // Recherche textuelle
      const matchesSearch = searchQuery === '' || 
        (client.contactInfo?.firstName && client.contactInfo.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.contactInfo?.lastName && client.contactInfo.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.contactInfo?.email && client.contactInfo.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.reference && client.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filtre par type
      const matchesType = filterType === 'tous' || 
        (filterType === 'particulier' && client.clientType === ClientType.PARTICULIER) ||
        (filterType === 'professionnel' && client.clientType !== ClientType.PARTICULIER);
      
      // Filtre par statut
      const matchesStatus = filterStatus === 'tous' || client.status === filterStatus;
      
      // Filtre par onglet
      const matchesTab = activeTab === 'tous' || 
        (activeTab === 'actifs' && client.status === 'ACTIF') ||
        (activeTab === 'prospects' && client.status === 'PROSPECT') ||
        (activeTab === 'incomplets' && (!client.contactInfo || !client.addresses || client.addresses.length === 0)) ||
        (activeTab === 'inactifs' && client.status === 'INACTIF');
      
      return matchesSearch && matchesType && matchesStatus && matchesTab;
    });
  };

  // Trier les clients
  const getSortedClients = () => {
    const filtered = getFilteredClients();
    
    switch (sortBy) {
      case 'recent':
        return [...filtered].sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      case 'alpha':
        return [...filtered].sort((a, b) => {
          const nameA = `${a.contactInfo?.firstName || ''} ${a.contactInfo?.lastName || ''}`;
          const nameB = `${b.contactInfo?.firstName || ''} ${b.contactInfo?.lastName || ''}`;
          return nameA.localeCompare(nameB);
        });
      case 'dossiers':
        return [...filtered].sort((a, b) => (b.dossiers?.length || 0) - (a.dossiers?.length || 0));
      default:
        return filtered;
    }
  };

  // Extension de la ligne client
  const toggleClientExpand = (clientId: string | undefined) => {
    if (!clientId) return;
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientId);
    }
  };

  // Rendu du composant
  return (
    <DashboardLayout activeMenu="clients">
      <div className="bg-gray-50 min-h-screen">
        {/* Contenu principal */}
        <main className="container mx-auto px-6 py-8">
          {/* Bannière d'en-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6 shadow-md">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Gestion des Clients</h1>
                <p className="text-blue-100">Centralisez et gérez toutes les informations de vos clients</p>
              </div>
              <div className="flex items-center bg-blue-700/50 px-4 py-2 rounded-lg">
                <Calendar className="mr-2 h-5 w-5" />
                <span className="font-medium">
                  {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Cartes de métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all h-[105px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Clients actifs</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.actifs}</p>
                </div>
                <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+{stats.nouveauxCeMois} nouveaux ce mois-ci</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all h-[105px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Prospects</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.prospects}</p>
                </div>
                <div className="p-2 rounded-md bg-amber-100 text-amber-600">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>{stats.conversionProspects}% taux de conversion</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all h-[105px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Dossiers par client</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.dossiersMoyenneParClient.toFixed(1)}
                  </p>
                </div>
                <div className="p-2 rounded-md bg-green-100 text-green-600">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span>En moyenne par client actif</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all h-[105px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Action rapide</h3>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Créer un client</p>
                </div>
                <div className="p-2 rounded-md bg-purple-100 text-purple-600">
                  <PlusCircle className="h-5 w-5" />
                </div>
              </div>
              <Link 
                href="/clients/new"
                className="w-full py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                <span>Nouveau client</span>
              </Link>
            </div>
          </div>
          
          {/* Barre de recherche et filtres */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="tous">Tous les types</option>
                  <option value="particulier">Particuliers</option>
                  <option value="professionnel">Professionnels</option>
                </select>
                
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="ACTIF">Actifs</option>
                  <option value="PROSPECT">Prospects</option>
                  <option value="INACTIF">Inactifs</option>
                </select>
                
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                  <Filter size={16} />
                  <span>Plus de filtres</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Trier par:</span>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Plus récents</option>
                  <option value="alpha">Alphabétique</option>
                  <option value="dossiers">Nb dossiers</option>
                </select>
              </div>
              
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm gap-2">
                <Download size={16} />
                <span>Exporter</span>
              </button>
              <Link
                href="/clients/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium gap-2 hover:bg-blue-700"
              >
                <Plus size={16} />
                <span>Nouveau client</span>
              </Link>
            </div>
          </div>
          
          {/* Onglets */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
            <div className="grid grid-cols-5 divide-x divide-gray-200">
              <button 
                onClick={() => setActiveTab('tous')}
                className={`p-4 flex flex-col items-center transition-all ${activeTab === 'tous' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-lg font-bold ${activeTab === 'tous' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {clients.length}
                </div>
                <div className="text-sm text-gray-500">Tous les clients</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('actifs')}
                className={`p-4 flex flex-col items-center transition-all ${activeTab === 'actifs' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-lg font-bold ${activeTab === 'actifs' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {stats.actifs}
                </div>
                <div className="text-sm text-gray-500">Clients actifs</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('prospects')}
                className={`p-4 flex flex-col items-center transition-all ${activeTab === 'prospects' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-lg font-bold ${activeTab === 'prospects' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {stats.prospects}
                </div>
                <div className="text-sm text-gray-500">Prospects</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('incomplets')}
                className={`p-4 flex flex-col items-center transition-all ${activeTab === 'incomplets' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-lg font-bold ${activeTab === 'incomplets' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {clients.filter(c => !c.contactInfo || !c.addresses || c.addresses.length === 0).length}
                </div>
                <div className="text-sm text-gray-500">Fiches incomplètes</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('inactifs')}
                className={`p-4 flex flex-col items-center transition-all ${activeTab === 'inactifs' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-lg font-bold ${activeTab === 'inactifs' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {stats.inactifs}
                </div>
                <div className="text-sm text-gray-500">Inactifs</div>
              </button>
            </div>
            
            {/* Liste des clients */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiches</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dossiers</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getSortedClients().length > 0 ? (
                      getSortedClients().map((client) => (
                        <React.Fragment key={client.id}>
                          <ClientListRow 
                            client={client} 
                            expanded={expandedClient === client.id} 
                            onToggleExpand={() => toggleClientExpand(client.id)}
                            onRefresh={() => {
                              console.log('Rafraîchissement après suppression');
                              const fetchClients = async () => {
                                try {
                                  setIsLoading(true);
                                  const { getClients } = await import('@/lib/api/clients');
                                  const result = await getClients();
                                  if (result && result.data) {
                                    setClients(result.data);
                                  }
                                } catch (error) {
                                  console.error('Erreur lors du rafraîchissement:', error);
                                } finally {
                                  setIsLoading(false);
                                }
                              };
                              fetchClients();
                            }}
                          />
                          
                          {/* Ligne détaillée */}
                          {expandedClient === client.id && (
                            <ClientExpandedRow client={client} />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center">
                          <div className="text-center">
                            <Users size={36} className="mx-auto text-gray-300 mb-2" />
                            <h3 className="text-base font-medium text-gray-500">Aucun client trouvé</h3>
                            <p className="text-sm text-gray-400 mt-1">Modifiez vos filtres ou créez un nouveau client</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && getSortedClients().length > 0 && (
              <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">1</span> à <span className="font-medium">{getSortedClients().length}</span> sur <span className="font-medium">{clients.length}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Précédent</span>
                        <ChevronRight className="h-5 w-5 transform rotate-180" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Suivant</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}

// Interface pour les données mockées
interface MockClient extends Partial<Client> {
  [key: string]: any; // Pour permettre des champs supplémentaires
}

// Données fictives pour les tests - utiliser un cast pour éviter les problèmes de type
const mockClients = [
  {
    id: '1',
    reference: 'CL-2025-042',
    clientType: ClientType.PARTICULIER,
    status: 'ACTIF',
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2025-05-14T14:30:00Z',
    lastContactDate: '2025-05-14T14:30:00Z',
    source: 'Site web',
    contactInfo: {
      id: 'contact_1',
      clientId: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '06 12 34 56 78',
    },
    addresses: [
      {
        id: '1',
        clientId: '1',
        street: '123 Rue Principale',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        type: AddressType.POSTAL
      }
    ],
    dossiers: [
      { id: '1', reference: 'DOS-2025-001', status: 'EN_COURS' },
      { id: '2', reference: 'DOS-2025-002', status: 'EN_COURS' }
    ],
    formLinks: [
      {
        id: 'form-1',
        clientId: '1',
        token: 'token-completed',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        emailSent: true,
        sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'CLIENT_FORM'
      }
    ]
  },
  {
    id: '2',
    reference: 'CL-2025-043',
    clientType: ClientType.MDT_ANTONY,
    status: 'ACTIF',
    createdAt: '2025-04-20T11:15:00Z',
    updatedAt: '2025-05-10T09:45:00Z',
    lastContactDate: '2025-05-10T09:45:00Z',
    source: 'Recommandation',
    contactInfo: {
      id: 'contact_2',
      clientId: '2',
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@example.com',
      phone: '06 23 45 67 89',
    },
    addresses: [
      {
        id: '2',
        clientId: '2',
        street: '45 Avenue Victor Hugo',
        city: 'Neuilly-sur-Seine',
        postalCode: '92200',
        country: 'France',
        type: AddressType.POSTAL
      }
    ],
    dossiers: [
      { id: '3', reference: 'DOS-2025-003', status: 'EN_COURS' }
    ],
    formLinks: [
      {
        id: 'form-2',
        clientId: '2',
        token: 'token-waiting',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        emailSent: true,
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'CLIENT_FORM'
      }
    ]
  },
  {
    id: '3',
    reference: 'CL-2025-044',
    clientType: ClientType.COMBLE_DF,
    status: 'INACTIF',
    createdAt: '2025-04-22T14:20:00Z',
    updatedAt: '2025-04-22T14:20:00Z',
    source: 'Salon de l\'habitat',
    contactInfo: {
      id: 'contact_3',
      clientId: '3',
      firstName: 'Pierre',
      lastName: 'Dubois',
      email: 'pierre.dubois@example.com',
      phone: '06 34 56 78 90',
    },
    addresses: [],
    formLinks: [
      {
        id: 'form-3',
        clientId: '3',
        token: 'token-expired',
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        emailSent: true,
        sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'CLIENT_FORM'
      }
    ]
  },
  {
    id: '4',
    reference: 'CL-2025-045',
    clientType: ClientType.PARTICULIER,
    status: 'ACTIF',
    createdAt: '2025-04-25T09:30:00Z',
    updatedAt: '2025-05-12T11:20:00Z',
    lastContactDate: '2025-05-12T11:20:00Z',
    contactInfo: {
      id: 'contact_4',
      clientId: '4',
      firstName: 'Emma',
      lastName: 'Bernard',
      email: 'emma.bernard@example.com',
      phone: '06 45 67 89 01',
    },
    addresses: [
      {
        id: '3',
        clientId: '4',
        street: '12 Boulevard Haussmann',
        city: 'Paris',
        postalCode: '75009',
        country: 'France',
        type: AddressType.POSTAL
      }
    ],
    dossiers: [
      { id: '4', reference: 'DOS-2025-004', status: 'EN_COURS' },
      { id: '5', reference: 'DOS-2025-005', status: 'TERMINÉ' },
      { id: '6', reference: 'DOS-2025-006', status: 'EN_ATTENTE' }
    ],
    formLinks: []
  }
];