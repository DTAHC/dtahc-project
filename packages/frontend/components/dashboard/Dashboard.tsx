import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Users, FileText, Clock, AlertCircle, CheckCircle, 
  Search, Filter, Calendar, Plus, ChevronDown, ChevronRight, 
  MoreVertical, RefreshCw, Eye, Edit2, Save, X
} from 'lucide-react';

// Types pour les données
type Dossier = {
  id: string;
  client: string;
  pro: string;
  type: string;
  etape: string;
  statut: string;
  priority: 'low' | 'normal' | 'high';
  date: string;
  clientEmail?: string;
  clientPhone?: string;
  clientId?: string;
  surface?: string;
  reference?: string;
  modifications: {
    field: string;
    oldValue: string;
    newValue: string;
    user: string;
    date: string;
  }[];
};

type EditingCell = {
  id: string;
  field: string;
} | null;

export default function Dashboard() {
  // États
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [monthFilter, setMonthFilter] = useState('Mai 2025');
  const [proFilter, setProFilter] = useState('Tous');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [etapeFilter, setEtapeFilter] = useState('Toutes');
  const [statutFilter, setStatutFilter] = useState('Tous');
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [showModificationHistory, setShowModificationHistory] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  
  // Données pour les sélecteurs
  const etatsOptions = ['Nouveau', 'En cours', 'Validation', 'Livré', 'Soumis', 'Accepté', 'Refusé'];
  const etapesOptions = ['INITIAL', 'ATTENTE PIÈCE', 'ÉTUDE APS', 'DOSSIER COMPLET', 'RE 2020', 'SIGNATURE ARCHI'];
  const statutsOptions = ['LIVRÉ CLIENT', 'DÉPÔT EN LIGNE', 'TOP URGENT', 'ANNULÉ', 'INCOMPLETUDE MAIRIE', 'REFUS DE PC/DP', 'À DÉPOSER EN LIGNE', 'À ENVOYER AU CLIENT'];
  const typesOptions = ['DP', 'DP+MUR', 'DP ITE', 'DP FENETRE', 'DP piscine', 'DP solair', 'PC+RT', 'PC+RT+SIGNATURE', 'PC MODIF', 'ERP', 'FENETRE + ITE', 'PLAN DE MASSE', 'PAC', 'Réalisation 3D'];
  const prosOptions = ['PARTICULIER', 'ARCADIA', 'COMBLE DF', 'ECA', 'LT ARTISAN', 'SODERBAT', 'COMBLESPACE', 'MDT ANTONY', 'MDT C.ROBERT', 'MDT YERRES', 'MDT ST-GEN', 'B3C', 'TERRASSE ET JAR', 'RENOKEA', 'GROUPE APB', 'PUREWATT', 'S.AUGUSTO', '3D TRAVAUX', 'BATI PRESTO', 'CPHF', 'MDT FONT'];
  
  // Données utilisateur courant
  const currentUser = {
    id: 'user1',
    name: 'Admin DTAHC',
    role: 'Administrateur'
  };
  
  // Données des dossiers
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(true);

  // État pour rafraîchir les données
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Force un rafraîchissement des données lors du focus sur la fenêtre
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Charger les dossiers depuis l'API
  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        setIsLoadingDossiers(true);
        console.log('Dashboard: Chargement des dossiers...');
        
        const response = await fetch('/api/dossiers', {
          // Éviter la mise en cache
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard: Dossiers récupérés:', data);
          
          // Transformer les données de l'API au format attendu par le dashboard
          const transformedDossiers = data.map((dossier: any) => {
            console.log('Traitement dossier:', dossier);
            return {
              id: dossier.id,
              client: `${dossier.client?.contactInfo?.firstName || ''} ${dossier.client?.contactInfo?.lastName || ''}`,
              pro: dossier.client?.clientType || 'PARTICULIER',
              type: dossier.type || 'DP FENETRE',
              etape: dossier.workflowState || 'INITIAL',
              statut: dossier.status || 'NOUVEAU',
              priority: dossier.priority?.toLowerCase() || 'normal',
              date: new Date(dossier.createdAt).toLocaleDateString('fr-FR'),
              clientEmail: dossier.client?.contactInfo?.email || '',
              clientPhone: dossier.client?.contactInfo?.phone || '',
              clientId: dossier.clientId || dossier.client?.id || '',
              reference: dossier.reference || '',
              surface: dossier.surfaceProjet ? `${dossier.surfaceProjet} m²` : '',
              modifications: dossier.modifications || []
            };
          });
          
          console.log('Dashboard: Dossiers transformés:', transformedDossiers);
          setDossiers(transformedDossiers);
        } else {
          console.error('Erreur lors du chargement des dossiers');
          // Utiliser des données fictives en cas d'erreur
          setDossiers([
            { 
              id: '001', 
              client: 'Dupont Jean', 
              pro: 'PARTICULIER', 
              type: 'DP FENETRE', 
              etape: 'ÉTUDE APS', 
              statut: 'ATTENTE PIÈCE', 
              priority: 'normal', 
              date: '12/05/2025',
              modifications: [
                { field: 'etape', oldValue: 'INITIAL', newValue: 'ÉTUDE APS', user: 'Julie Martin', date: '10/05/2025 09:30' }
              ]
            },
            { 
              id: '002', 
              client: 'Martin Sophie', 
              pro: 'MDT ANTONY', 
              type: 'DP+MUR', 
              etape: 'INITIAL', 
              statut: 'TOP URGENT', 
              priority: 'high', 
              date: '15/05/2025',
              modifications: [
                { field: 'statut', oldValue: 'ATTENTE PIÈCE', newValue: 'TOP URGENT', user: 'Admin DTAHC', date: '15/05/2025 08:15' }
              ]
            },
            { 
              id: '003', 
              client: 'Lefebvre Pierre', 
              pro: 'COMBLE DF', 
              type: 'PC+RT', 
              etape: 'DOSSIER COMPLET', 
              statut: 'À DÉPOSER EN LIGNE', 
              priority: 'normal', 
              date: '10/05/2025',
              modifications: []
            }
          ]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        // Utiliser des données fictives en cas d'erreur
        setDossiers([
          { 
            id: '001', 
            client: 'Dupont Jean', 
            pro: 'PARTICULIER', 
            type: 'DP FENETRE', 
            etape: 'ÉTUDE APS', 
            statut: 'ATTENTE PIÈCE', 
            priority: 'normal', 
            date: '12/05/2025',
            modifications: [
              { field: 'etape', oldValue: 'INITIAL', newValue: 'ÉTUDE APS', user: 'Julie Martin', date: '10/05/2025 09:30' }
            ]
          },
          { 
            id: '002', 
            client: 'Martin Sophie', 
            pro: 'MDT ANTONY', 
            type: 'DP+MUR', 
            etape: 'INITIAL', 
            statut: 'TOP URGENT', 
            priority: 'high', 
            date: '15/05/2025',
            modifications: [
              { field: 'statut', oldValue: 'ATTENTE PIÈCE', newValue: 'TOP URGENT', user: 'Admin DTAHC', date: '15/05/2025 08:15' }
            ]
          },
          { 
            id: '003', 
            client: 'Lefebvre Pierre', 
            pro: 'COMBLE DF', 
            type: 'PC+RT', 
            etape: 'DOSSIER COMPLET', 
            statut: 'À DÉPOSER EN LIGNE', 
            priority: 'normal', 
            date: '10/05/2025',
            modifications: []
          }
        ]);
      } finally {
        setIsLoadingDossiers(false);
      }
    };
    
    fetchDossiers();
  }, [refreshKey]);
  
  // Fonction pour basculer l'expansion des lignes
  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    setShowModificationHistory(false);
  };
  
  // Fonction pour commencer l'édition d'une cellule
  const startEditing = (dossierId: string, field: string) => {
    setEditingCell({ id: dossierId, field });
  };
  
  // Fonction pour annuler l'édition
  const cancelEditing = () => {
    setEditingCell(null);
  };
  
  // Fonction pour sauvegarder la modification
  const saveEdit = (dossierId: string, field: string, value: string) => {
    const dossierToUpdate = dossiers.find(d => d.id === dossierId);
    
    if (!dossierToUpdate) return;
    
    const oldValue = dossierToUpdate[field as keyof Dossier] as string;
    
    // N'enregistrer la modification que si la valeur a changé
    if (oldValue !== value) {
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newModification = {
        field,
        oldValue,
        newValue: value,
        user: currentUser.name,
        date: formattedDate
      };
      
      const updatedDossiers = dossiers.map(dossier => 
        dossier.id === dossierId ? 
          { 
            ...dossier, 
            [field]: value,
            modifications: [newModification, ...dossier.modifications]
          } : dossier
      );
      
      setDossiers(updatedDossiers);
    }
    
    setEditingCell(null);
  };
  
  // Afficher l'historique des modifications
  const toggleModificationHistory = (dossierId: string) => {
    setSelectedHistoryId(dossierId);
    setShowModificationHistory(!showModificationHistory);
  };
  
  // Composant d'édition de cellule
  const EditableCell = ({ 
    dossierId, 
    field, 
    value, 
    options 
  }: { 
    dossierId: string; 
    field: string; 
    value: string; 
    options: string[];
  }) => {
    const isEditing = editingCell && editingCell.id === dossierId && editingCell.field === field;
    const [tempValue, setTempValue] = useState(value);
    
    if (isEditing) {
      return (
        <div className="flex items-center">
          <select 
            className="w-full rounded border-gray-300 text-sm py-1 pr-8"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button 
            className="p-1 ml-1 text-green-600 hover:bg-green-50 rounded" 
            onClick={() => saveEdit(dossierId, field, tempValue)}
          >
            <Save size={14} />
          </button>
          <button 
            className="p-1 ml-1 text-red-600 hover:bg-red-50 rounded" 
            onClick={cancelEditing}
          >
            <X size={14} />
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center group">
        <span className="text-gray-700">{value}</span>
        <button 
          className="p-1 ml-2 text-gray-400 invisible group-hover:visible hover:bg-gray-100 rounded" 
          onClick={() => startEditing(dossierId, field)}
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };
  
  return (
    <div>
      {/* Page title and actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord DTAHC</h1>
          <p className="text-gray-500 text-sm">Vue d'ensemble des dossiers et des tâches</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-sm text-gray-500">
            <RefreshCw size={16} className="mr-2" /> 
            Dernière mise à jour: 16/05/2025 10:24
          </span>
          
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
            <Plus size={16} />
            <span>Nouveau dossier</span>
          </button>
        </div>
      </div>
      
      {/* Metrics Cards - Optimisés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Dossiers</h2>
            <div className="flex items-end">
              <p className="text-3xl font-semibold text-gray-800">32</p>
              <span className="ml-2 text-sm text-gray-500">actifs</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">Nouveaux</span>
                <p className="font-medium text-blue-600">5</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">À déposer</span>
                <p className="font-medium text-green-600">4</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Complétés</span>
                <p className="font-medium text-purple-600">12</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-4">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Statut des dossiers</h2>
            <div className="flex items-end">
              <p className="text-3xl font-semibold text-gray-800">15</p>
              <span className="ml-2 text-sm text-gray-500">en cours</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">Attente</span>
                <p className="font-medium text-amber-600">3</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">Urgents</span>
                <p className="font-medium text-red-600">2</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Instruction</span>
                <p className="font-medium text-cyan-600">8</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Clients & Facturation</h2>
            <div className="flex items-end">
              <p className="text-3xl font-semibold text-gray-800">15</p>
              <span className="ml-2 text-sm text-gray-500">clients actifs</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">À facturer</span>
                <p className="font-medium text-blue-600">3</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">Impayés</span>
                <p className="font-medium text-red-600">2</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Ce mois</span>
                <p className="font-medium text-green-600">+2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un dossier..." 
            className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-200 text-gray-600 rounded-lg px-3 py-1.5">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">Mai 2025</span>
          </div>
          
          <button 
            className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">Filtres</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveFilter('all')}>
          Tous les dossiers
        </button>
        
        <button className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'urgent' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveFilter('urgent')}>
          Dossiers urgents
        </button>
        
        <button className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'waiting' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveFilter('waiting')}>
          En attente client
        </button>
        
        <button className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'deposit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveFilter('deposit')}>
          À déposer
        </button>
        
        <button className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'incomplete' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveFilter('incomplete')}>
          Incomplets
        </button>
      </div>
      
      {/* Dossiers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pro</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Étape</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priorité</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dossiers.map((dossier, index) => (
              <React.Fragment key={dossier.id}>
                <tr 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                  onClick={() => toggleExpand(dossier.id)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      {expandedRow === dossier.id ? 
                        <ChevronDown size={16} className="mr-2 text-gray-400" /> : 
                        <ChevronRight size={16} className="mr-2 text-gray-400" />
                      }
                      {dossier.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{dossier.client}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dossier.pro === 'PARTICULIER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {dossier.pro}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <EditableCell 
                      dossierId={dossier.id} 
                      field="type" 
                      value={dossier.type} 
                      options={typesOptions}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <EditableCell 
                      dossierId={dossier.id} 
                      field="etape" 
                      value={dossier.etape} 
                      options={etapesOptions}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <EditableCell 
                      dossierId={dossier.id} 
                      field="statut" 
                      value={dossier.statut} 
                      options={statutsOptions}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`w-16 h-1.5 rounded-full ${
                      dossier.priority === 'high' ? 'bg-red-500' : 
                      dossier.priority === 'normal' ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}></div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{dossier.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-md hover:bg-gray-100">
                        <Eye size={16} className="text-gray-500" />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100">
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {expandedRow === dossier.id && (
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan={9} className="px-4 py-3">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h3 className="font-medium text-sm text-gray-700 mb-2">Informations client</h3>
                          <p className="text-sm mb-1">
                            <span className="text-gray-500 mr-2">Pro:</span>{dossier.pro}
                          </p>
                          <p className="text-sm mb-1">
                            <span className="text-gray-500 mr-2">Client:</span>{dossier.client}
                          </p>
                          <p className="text-sm mb-1">
                            <span className="text-gray-500 mr-2">Email:</span>{dossier.clientEmail || "Non renseigné"}
                          </p>
                          <p className="text-sm mb-1">
                            <span className="text-gray-500 mr-2">Téléphone:</span>{dossier.clientPhone || "Non renseigné"}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500 mr-2">Réf.:</span>{dossier.reference || "Non renseigné"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-700 mb-2">Informations dossier</h3>
                          <div className="text-sm mb-2 flex items-center">
                            <span className="text-gray-500 mr-2 min-w-16">Type:</span>
                            <EditableCell 
                              dossierId={dossier.id} 
                              field="type" 
                              value={dossier.type} 
                              options={typesOptions}
                            />
                          </div>
                          <div className="text-sm mb-2 flex items-center">
                            <span className="text-gray-500 mr-2 min-w-16">Étape:</span>
                            <EditableCell 
                              dossierId={dossier.id} 
                              field="etape" 
                              value={dossier.etape} 
                              options={etapesOptions}
                            />
                          </div>
                          <div className="text-sm mb-2 flex items-center">
                            <span className="text-gray-500 mr-2 min-w-16">Statut:</span>
                            <EditableCell 
                              dossierId={dossier.id} 
                              field="statut" 
                              value={dossier.statut} 
                              options={statutsOptions}
                            />
                          </div>
                          <div className="text-sm flex items-center">
                            <span className="text-gray-500 mr-2 min-w-16">Surface:</span>
                            <span>{dossier.surface || "Non renseignée"}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-sm text-gray-700">Actions rapides</h3>
                            <button 
                              className="text-xs text-blue-600 flex items-center"
                              onClick={() => toggleModificationHistory(dossier.id)}
                            >
                              {showModificationHistory && selectedHistoryId === dossier.id ? 'Masquer historique' : 'Voir historique'}
                            </button>
                          </div>
                          <div className="flex space-x-2 mb-3">
                            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                              Voir les détails
                            </button>
                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                              Modifier
                            </button>
                          </div>
                          
                          {showModificationHistory && selectedHistoryId === dossier.id && (
                            <div className="mt-2 border-t border-gray-200 pt-2">
                              <h4 className="text-xs font-medium text-gray-600 mb-1">Historique des modifications</h4>
                              {dossier.modifications.length > 0 ? (
                                <div className="max-h-36 overflow-y-auto">
                                  {dossier.modifications.map((mod, idx) => (
                                    <div key={idx} className="text-xs mb-1.5 py-1 px-2 bg-gray-100 rounded">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">{mod.field}</span>
                                        <span className="text-gray-500">{mod.date}</span>
                                      </div>
                                      <div className="flex">
                                        <span className="text-red-500 line-through mr-2">{mod.oldValue}</span>
                                        <span className="text-green-600">{mod.newValue}</span>
                                      </div>
                                      <div className="text-gray-500 italic">
                                        Par: {mod.user}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">Aucune modification enregistrée</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur <span className="font-medium">32</span> résultats
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                Précédent
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Échéances à venir</h2>
          <button className="text-blue-600 text-sm">Voir tout</button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            { title: 'Dépôt dossier Martin', date: '18/05/2025', client: 'Martin Sophie', priority: 'high' },
            { title: 'Réunion ABF - Projet Durand', date: '20/05/2025', client: 'Durand Thomas', priority: 'normal' },
            { title: 'Date limite DAACT - Dossier Petit', date: '22/05/2025', client: 'Petit Jacques', priority: 'normal' },
            { title: 'Réception avis urbanisme', date: '25/05/2025', client: 'Lefebvre Pierre', priority: 'low' }
          ].map((event, index) => (
            <div key={index} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  event.priority === 'high' ? 'bg-red-500' : 
                  event.priority === 'normal' ? 'bg-amber-500' : 
                  'bg-green-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{event.title}</p>
                  <p className="text-xs text-gray-500">Client: {event.client}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">{event.date}</span>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}