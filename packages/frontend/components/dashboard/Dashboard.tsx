'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart2, Users, FileText, Clock, AlertCircle, CheckCircle, 
  Search, Filter, Calendar, Plus, ChevronDown, ChevronRight, 
  MoreVertical, RefreshCw, Eye, Edit2, Save, X, 
  ArrowDownUp, Clipboard, FileCheck, AlertTriangle, ListFilter
} from 'lucide-react';
import { formatDossierId, formatDate } from '@/utils/formatters';
import { updateDossier } from '@/lib/api/dossiers';
import { DossierType, WorkflowState, DossierStatus, Priority } from '@dtahc/shared';

// Types pour les données améliorées
type Dossier = {
  id: string;
  client: string;
  pro: string;
  type: string;
  etape: string;
  statut: string;
  priority: 'low' | 'normal' | 'high';
  date: string;
  dateObj: Date;
  clientEmail?: string;
  clientPhone?: string;
  clientId?: string;
  reference?: string;
  surface?: string;
  surfaceExistant?: number;
  surfaceProjet?: number;
  deadline?: Date | null;
  rawData: any; // Les données brutes pour les mises à jour API
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
  const [priorityFilter, setPriorityFilter] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [showModificationHistory, setShowModificationHistory] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Données pour les sélecteurs
  const etatsOptions = ['Nouveau', 'En cours', 'Validation', 'Livré', 'Soumis', 'Accepté', 'Refusé'];
  const etapesOptions = ['INITIAL', 'ATTENTE_PIECE', 'ETUDE_APS', 'DOSSIER_COMPLET', 'RE_2020', 'SIGNATURE_ARCHI'];
  const statutsOptions = ['NOUVEAU', 'LIVRE_CLIENT', 'DEPOT_EN_LIGNE', 'TOP_URGENT', 'ANNULE', 'INCOMPLETUDE_MAIRIE', 'REFUS', 'A_DEPOSER_EN_LIGNE', 'A_ENVOYER_AU_CLIENT', 'EN_INSTRUCTION', 'ACCEPTE'];
  const typesOptions = ['DP', 'DP_MUR', 'DP_ITE', 'DP_FENETRE', 'DP_PISCINE', 'DP_SOLAIRE', 'PC_RT', 'PC_RT_SIGNATURE', 'PC_MODIF', 'ERP', 'FENETRE_ITE', 'PLAN_DE_MASSE', 'PAC', 'REALISATION_3D'];
  const prosOptions = ['PARTICULIER', 'ARCADIA', 'COMBLE_DF', 'ECA', 'LT_ARTISAN', 'SODERBAT', 'COMBLESPACE', 'MDT_ANTONY', 'MDT_C_ROBERT', 'MDT_YERRES', 'MDT_ST_GEN', 'B3C', 'TERRASSE_ET_JAR', 'RENOKEA', 'GROUPE_APB', 'PUREWATT', 'S_AUGUSTO', '3D_TRAVAUX', 'BATI_PRESTO', 'CPHF', 'MDT_FONT'];
  
  // Données utilisateur courant
  const currentUser = {
    id: 'user1',
    name: 'Admin DTAHC',
    role: 'Administrateur'
  };
  
  // Données des dossiers
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(true);
  
  // Statistiques calculées
  const [stats, setStats] = useState({
    total: 0,
    nouveaux: 0,
    aDeposer: 0,
    completes: 0,
    enCours: 0,
    attente: 0,
    urgents: 0,
    instruction: 0,
    clients: 0,
    aFacturer: 0,
    impayes: 0,
    nouveauxMois: 0
  });

  // État pour rafraîchir les données
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Gestion des événements de modification et de mise en évidence des dossiers
  useEffect(() => {
    // Protection contre le SSR (exécuter uniquement côté client)
    if (typeof window === 'undefined') return;
    
    // Vérifier si un dossier doit être mis en évidence (après création depuis fiche-projet)
    const checkForHighlightedDossier = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const highlightDossierId = urlParams.get('highlight');
      
      if (highlightDossierId) {
        console.log('Dashboard: Highlighting dossier:', highlightDossierId);
        // Mettre à jour l'état pour mettre en évidence la ligne
        setExpandedRow(highlightDossierId);
        
        // Optionnellement, faire défiler jusqu'à la ligne mise en évidence
        setTimeout(() => {
          const element = document.getElementById(`dossier-${highlightDossierId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
        
        // Nettoyage de l'URL pour éviter les rechargements constants
        if (history.replaceState) {
          history.replaceState(null, '', window.location.pathname);
        }
      }
    };
    
    // Rafraîchir uniquement quand un dossier est ajouté ou modifié
    const handleDossierUpdated = (event: Event) => {
      // Cast à CustomEvent si possible
      const customEvent = event as CustomEvent;
      const details = customEvent.detail || {};
      
      console.log('Dashboard: dossierStorageUpdated event received', details);
      // Incrémenter la clé de rafraîchissement pour déclencher un re-fetch
      setRefreshKey(prev => prev + 1);
    };
    
    // Écouter uniquement les événements dossierStorageUpdated
    window.addEventListener('dossierStorageUpdated', handleDossierUpdated as EventListener);
    
    // Vérifier une fois au chargement si un ID est à mettre en évidence
    checkForHighlightedDossier();
    
    return () => {
      window.removeEventListener('dossierStorageUpdated', handleDossierUpdated as EventListener);
    };
  }, []);
  
  // Fonction pour traiter les dossiers
  const processStoredDossiers = (data: any[]) => {
    // Transformer les données au format attendu par le dashboard
    const transformedDossiers = data.map((dossier: any) => {
      return {
        id: dossier.id,
        client: `${dossier.client?.contactInfo?.firstName || ''} ${dossier.client?.contactInfo?.lastName || ''}`,
        pro: dossier.client?.clientType || 'PARTICULIER',
        type: dossier.type || 'DP_FENETRE',
        etape: dossier.workflowState || 'INITIAL',
        statut: dossier.status || 'NOUVEAU',
        priority: dossier.priority?.toLowerCase() || 'normal',
        date: new Date(dossier.createdAt).toLocaleDateString('fr-FR'),
        dateObj: new Date(dossier.createdAt),
        clientEmail: dossier.client?.contactInfo?.email || '',
        clientPhone: dossier.client?.contactInfo?.phone || '',
        clientId: dossier.clientId || dossier.client?.id || '',
        reference: dossier.reference || '',
        surface: dossier.surfaceProjet ? `${dossier.surfaceProjet} m²` : '',
        surfaceExistant: dossier.surfaceExistant,
        surfaceProjet: dossier.surfaceProjet,
        deadline: dossier.deadline ? new Date(dossier.deadline) : null,
        rawData: dossier, // Store the original data for API updates
        modifications: dossier.modifications || []
      };
    });
    
    console.log('Dashboard: Dossiers transformés:', transformedDossiers);
    setDossiers(transformedDossiers);
    calculateStats(transformedDossiers);
    setLastUpdated(new Date());
  };
  
  // Charger les dossiers depuis l'API ou localStorage
  useEffect(() => {
    console.log(`Dashboard: fetchDossiers called with refreshKey=${refreshKey}`);
    
    // Variable pour suivre si le composant est monté
    let isMounted = true;
    
    const fetchDossiers = async () => {
      // Éviter des appels multiples si en cours de chargement
      if (isUpdating) return;
      
      try {
        setIsLoadingDossiers(true);
        setIsUpdating(true);
        console.log('Dashboard: Chargement des dossiers...');
        
        // Utiliser localStorage directement
        if (typeof window !== 'undefined') {
          const storedDossiers = localStorage.getItem('dtahc_dossiers');
          if (storedDossiers) {
            console.log('Dashboard: Utilisation des dossiers depuis localStorage');
            const data = JSON.parse(storedDossiers);
            processStoredDossiers(data);
            
            if (isMounted) {
              setIsLoadingDossiers(false);
              setIsUpdating(false);
            }
            return;
          }
        }
        
        // Fallback à l'API si pas de données locales
        try {
          const response = await fetch('/api/dossiers', {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            cache: 'no-store',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Dashboard: Dossiers récupérés de l\'API:', data);
            
            if (isMounted) {
              processStoredDossiers(data);
            }
          } else {
            throw new Error('Erreur lors de la récupération des dossiers');
          }
        } catch (error) {
          console.error('Erreur API:', error);
          
          // Utiliser des données fictives en cas d'erreur
          const mockDossiers = [
            { 
              id: '001', 
              client: 'Dupont Jean', 
              pro: 'PARTICULIER', 
              type: 'DP_FENETRE', 
              etape: 'INITIAL', 
              statut: 'NOUVEAU', 
              priority: 'normal', 
              date: '12/05/2025',
              dateObj: new Date('2025-05-12'),
              reference: 'DOS-2025-001',
              clientEmail: 'jean.dupont@example.com',
              clientPhone: '06 12 34 56 78',
              clientId: 'cl-001',
              surface: '45 m²',
              surfaceExistant: 45,
              surfaceProjet: 45,
              deadline: new Date('2025-06-12'),
              rawData: null,
              modifications: [
                { field: 'etape', oldValue: 'INITIAL', newValue: 'ÉTUDE APS', user: 'Julie Martin', date: '10/05/2025 09:30' }
              ]
            },
            { 
              id: '002', 
              client: 'Martin Sophie', 
              pro: 'MDT_ANTONY', 
              type: 'DP_MUR', 
              etape: 'INITIAL', 
              statut: 'TOP_URGENT', 
              priority: 'high', 
              date: '15/05/2025',
              dateObj: new Date('2025-05-15'),
              reference: 'DOS-2025-002',
              clientEmail: 'sophie.martin@example.com',
              clientPhone: '06 23 45 67 89',
              clientId: 'cl-002',
              surface: '32 m²',
              surfaceExistant: 32,
              surfaceProjet: 32,
              deadline: new Date('2025-06-15'),
              rawData: null,
              modifications: [
                { field: 'statut', oldValue: 'ATTENTE_PIECE', newValue: 'TOP_URGENT', user: 'Admin DTAHC', date: '15/05/2025 08:15' }
              ]
            },
            { 
              id: '003', 
              client: 'Lefebvre Pierre', 
              pro: 'COMBLE_DF', 
              type: 'PC_RT', 
              etape: 'DOSSIER_COMPLET', 
              statut: 'A_DEPOSER_EN_LIGNE', 
              priority: 'normal', 
              date: '10/05/2025',
              dateObj: new Date('2025-05-10'),
              reference: 'DOS-2025-003',
              clientEmail: 'pierre.lefebvre@example.com',
              clientPhone: '06 34 56 78 90',
              clientId: 'cl-003',
              surface: '68 m²',
              surfaceExistant: 68,
              surfaceProjet: 68,
              deadline: new Date('2025-06-10'),
              rawData: null,
              modifications: []
            }
          ];
          
          if (isMounted) {
            setDossiers(mockDossiers);
            calculateStats(mockDossiers);
            setLastUpdated(new Date());
          }
        }
      } catch (error) {
        console.error('Erreur générale:', error);
      } finally {
        if (isMounted) {
          setIsLoadingDossiers(false);
          setIsUpdating(false);
        }
      }
    };
    
    fetchDossiers();
    
    // Nettoyage
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);
  
  // Fonction pour calculer les statistiques
  const calculateStats = (dossierList: Dossier[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Map pour stocker les ID clients uniques
    const uniqueClients = new Set();
    
    // Compteurs pour les différents statuts
    let nouveaux = 0;
    let aDeposer = 0;
    let completes = 0;
    let enCours = 0;
    let attente = 0;
    let urgents = 0;
    let instruction = 0;
    let aFacturer = 0;
    let impayes = 0;
    let nouveauxMois = 0;
    
    dossierList.forEach(dossier => {
      // Ajouter l'ID client à l'ensemble des clients uniques
      uniqueClients.add(dossier.clientId);
      
      // Vérifier si le dossier a été créé ce mois-ci
      if (dossier.dateObj && 
          dossier.dateObj.getMonth() === currentMonth && 
          dossier.dateObj.getFullYear() === currentYear) {
        nouveauxMois++;
      }
      
      // Comptabiliser selon le statut
      if (dossier.statut === 'NOUVEAU') nouveaux++;
      if (dossier.statut === 'A_DEPOSER_EN_LIGNE') aDeposer++;
      if (dossier.statut === 'LIVRE_CLIENT') completes++;
      if (dossier.statut === 'EN_INSTRUCTION') instruction++;
      if (dossier.etape === 'ATTENTE_PIECE') attente++;
      if (dossier.priority === 'high' || dossier.statut === 'TOP_URGENT') urgents++;
      
      // Compter les dossiers en cours
      if (['ETUDE_APS', 'DOSSIER_COMPLET', 'RE_2020', 'SIGNATURE_ARCHI'].includes(dossier.etape)) {
        enCours++;
      }
      
      // Compter pour la facturation (à adapter selon les critères réels)
      if (['LIVRE_CLIENT', 'DOSSIER_COMPLET'].includes(dossier.etape) && 
          !['FACTURE', 'PAYE'].includes(dossier.statut)) {
        aFacturer++;
      }
      
      // Compter les impayés (critères fictifs à adapter)
      if (['FACTURE'].includes(dossier.statut)) {
        impayes++;
      }
    });
    
    setStats({
      total: dossierList.length,
      nouveaux,
      aDeposer,
      completes,
      enCours,
      attente,
      urgents,
      instruction,
      clients: uniqueClients.size,
      aFacturer,
      impayes,
      nouveauxMois
    });
  };
  
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
  const saveEdit = async (dossierId: string, field: string, value: string) => {
    const dossierToUpdate = dossiers.find(d => d.id === dossierId);
    
    if (!dossierToUpdate) return;
    
    const oldValue = dossierToUpdate[field as keyof Dossier] as string;
    
    // N'enregistrer la modification que si la valeur a changé
    if (oldValue !== value) {
      setIsUpdating(true);
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newModification = {
        field,
        oldValue,
        newValue: value,
        user: currentUser.name,
        date: formattedDate
      };
      
      try {
        // Mapper les champs d'affichage vers les champs API
        const apiFieldMap: Record<string, string> = {
          'type': 'type',
          'etape': 'workflowState',
          'statut': 'status',
          'priority': 'priority'
        };
        
        // Mapper les valeurs d'affichage vers les valeurs API
        const apiValueMap: Record<string, any> = {
          'type': (val: string) => val,
          'etape': (val: string) => val,
          'statut': (val: string) => val,
          'priority': (val: string) => val.toUpperCase()
        };
        
        // Préparer les données pour l'API
        const apiField = apiFieldMap[field] || field;
        const apiValue = apiValueMap[field] ? apiValueMap[field](value) : value;
        
        // Mise à jour optimiste de l'UI
        const updatedDossiers = dossiers.map(dossier => 
          dossier.id === dossierId ? 
            { 
              ...dossier, 
              [field]: value,
              modifications: [newModification, ...dossier.modifications]
            } : dossier
        );
        
        setDossiers(updatedDossiers);
        calculateStats(updatedDossiers);
        
        // Envoyer la mise à jour à l'API
        if (dossierToUpdate.rawData) {
          const updateData = {
            [apiField]: apiValue
          };
          
          const response = await updateDossier(dossierId, updateData);
          console.log('Mise à jour enregistrée:', response);
        } else {
          console.log('Mise à jour locale uniquement (pas de données raw disponibles)');    
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du dossier:', error);
        // En cas d'erreur, on pourrait restaurer l'ancienne valeur
        // mais pour simplifier, on garde la mise à jour optimiste
      } finally {
        setIsUpdating(false);
        setLastUpdated(new Date());
      }
    }
    
    setEditingCell(null);
  };
  
  // Afficher l'historique des modifications
  const toggleModificationHistory = (dossierId: string) => {
    setSelectedHistoryId(dossierId);
    setShowModificationHistory(!showModificationHistory);
  };

  // Filter dossiers based on filters
  const filteredDossiers = useMemo(() => {
    return dossiers.filter(dossier => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          dossier.client.toLowerCase().includes(searchLower) ||
          dossier.reference?.toLowerCase().includes(searchLower) ||
          dossier.type.toLowerCase().includes(searchLower) ||
          dossier.statut.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Pre-defined filters
      if (activeFilter === 'urgent' && dossier.priority !== 'high' && dossier.statut !== 'TOP_URGENT') return false;
      if (activeFilter === 'waiting' && dossier.etape !== 'ATTENTE_PIECE') return false;
      if (activeFilter === 'deposit' && dossier.statut !== 'A_DEPOSER_EN_LIGNE') return false;
      if (activeFilter === 'incomplete' && dossier.statut !== 'INCOMPLETUDE_MAIRIE') return false;
      
      // Advanced filters
      if (proFilter !== 'Tous' && dossier.pro !== proFilter) return false;
      if (typeFilter !== 'Tous' && dossier.type !== typeFilter) return false;
      if (etapeFilter !== 'Toutes' && dossier.etape !== etapeFilter) return false;
      if (statutFilter !== 'Tous' && dossier.statut !== statutFilter) return false;
      if (priorityFilter !== 'Toutes' && dossier.priority !== priorityFilter.toLowerCase()) return false;
      
      return true;
    });
  }, [dossiers, searchQuery, activeFilter, proFilter, typeFilter, etapeFilter, statutFilter, priorityFilter]);
  
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
            <RefreshCw size={16} className={`mr-2 ${isUpdating ? 'animate-spin' : ''}`} /> 
            Dernière mise à jour: {formatDate(lastUpdated)}
          </span>
          
          <a href="/clients/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            <span>Nouveau dossier</span>
          </a>
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
              <p className="text-3xl font-semibold text-gray-800">{stats.total}</p>
              <span className="ml-2 text-sm text-gray-500">actifs</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">Nouveaux</span>
                <p className="font-medium text-blue-600">{stats.nouveaux}</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">À déposer</span>
                <p className="font-medium text-green-600">{stats.aDeposer}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Complétés</span>
                <p className="font-medium text-purple-600">{stats.completes}</p>
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
              <p className="text-3xl font-semibold text-gray-800">{stats.enCours}</p>
              <span className="ml-2 text-sm text-gray-500">en cours</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">Attente</span>
                <p className="font-medium text-amber-600">{stats.attente}</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">Urgents</span>
                <p className="font-medium text-red-600">{stats.urgents}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Instruction</span>
                <p className="font-medium text-cyan-600">{stats.instruction}</p>
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
              <p className="text-3xl font-semibold text-gray-800">{stats.clients}</p>
              <span className="ml-2 text-sm text-gray-500">clients actifs</span>
            </div>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="text-xs text-gray-500">À facturer</span>
                <p className="font-medium text-blue-600">{stats.aFacturer}</p>
              </div>
              <div className="mr-4">
                <span className="text-xs text-gray-500">Impayés</span>
                <p className="font-medium text-red-600">{stats.impayes}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Ce mois</span>
                <p className="font-medium text-green-600">+{stats.nouveauxMois}</p>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-200 text-gray-600 rounded-lg px-3 py-1.5">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">Mai 2025</span>
          </div>
          
          <button 
            className={`flex items-center border rounded-lg px-3 py-1.5 ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className={`mr-2 ${showFilters ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className="text-sm">Filtres</span>
            <ChevronDown size={16} className={`ml-2 ${showFilters ? 'text-blue-500 transform rotate-180' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type de pro</label>
            <select 
              className="w-full border border-gray-300 rounded-md text-sm py-2"
              value={proFilter}
              onChange={(e) => setProFilter(e.target.value)}
            >
              <option value="Tous">Tous les pros</option>
              {prosOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type de dossier</label>
            <select 
              className="w-full border border-gray-300 rounded-md text-sm py-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="Tous">Tous les types</option>
              {typesOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Étape</label>
            <select 
              className="w-full border border-gray-300 rounded-md text-sm py-2"
              value={etapeFilter}
              onChange={(e) => setEtapeFilter(e.target.value)}
            >
              <option value="Toutes">Toutes les étapes</option>
              {etapesOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
            <select 
              className="w-full border border-gray-300 rounded-md text-sm py-2"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <option value="Tous">Tous les statuts</option>
              {statutsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
            <select 
              className="w-full border border-gray-300 rounded-md text-sm py-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="Toutes">Toutes les priorités</option>
              <option value="High">Haute</option>
              <option value="Normal">Normale</option>
              <option value="Low">Basse</option>
            </select>
          </div>
        </div>
      )}
      
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
            {isLoadingDossiers ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw size={24} className="animate-spin mb-3 text-blue-500" />
                    <p>Chargement des dossiers...</p>
                  </div>
                </td>
              </tr>
            ) : filteredDossiers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <ListFilter size={24} className="mb-3 text-gray-400" />
                    <p>Aucun dossier ne correspond aux critères de filtrage</p>
                    <button 
                      className="mt-3 text-blue-600 text-sm underline"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                        setProFilter('Tous');
                        setTypeFilter('Tous');
                        setEtapeFilter('Toutes');
                        setStatutFilter('Tous');
                        setPriorityFilter('Toutes');
                      }}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredDossiers.map((dossier, index) => (
              <React.Fragment key={dossier.id}>
                <tr 
                  id={`dossier-${dossier.id}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${expandedRow === dossier.id ? 'bg-blue-50' : ''}`} 
                  onClick={() => toggleExpand(dossier.id)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      {expandedRow === dossier.id ? 
                        <ChevronDown size={16} className="mr-2 text-gray-400" /> : 
                        <ChevronRight size={16} className="mr-2 text-gray-400" />
                      }
                      {formatDossierId(dossier.id, dossier.reference)}
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
                      <a href={`/clients/${dossier.clientId}`} className="p-1 rounded-md hover:bg-gray-100">
                        <Eye size={16} className="text-gray-500" />
                      </a>
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
                            <a href={`/clients/${dossier.clientId}`} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                              Voir les détails
                            </a>
                            <a href={`/clients/${dossier.clientId}/edit`} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                              Modifier
                            </a>
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
                Affichage de <span className="font-medium">{filteredDossiers.length > 0 ? 1 : 0}</span> à <span className="font-medium">{Math.min(filteredDossiers.length, 10)}</span> sur <span className="font-medium">{filteredDossiers.length}</span> résultats
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true} // À ajuster avec pagination réelle
              >
                Précédent
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={filteredDossiers.length <= 10} // À ajuster avec pagination réelle
              >
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
          {isLoadingDossiers ? (
            <div className="py-8 text-center text-gray-500">
              <RefreshCw size={20} className="animate-spin mx-auto mb-3" />
              <p>Chargement des échéances...</p>
            </div>
          ) : dossiers.filter(d => d.deadline).length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Calendar size={20} className="mx-auto mb-3" />
              <p>Aucune échéance à venir</p>
            </div>
          ) : dossiers
            .filter(d => d.deadline) // Filter dossiers with deadlines
            .sort((a, b) => (a.deadline && b.deadline) ? a.deadline.getTime() - b.deadline.getTime() : 0) // Sort by deadline
            .slice(0, 4) // Only show first 4
            .map((dossier, index) => {
              // Generate event title based on dossier state
              let eventTitle = '';
              if (dossier.statut === 'A_DEPOSER_EN_LIGNE') {
                eventTitle = `Dépôt dossier ${dossier.client}`;
              } else if (dossier.etape === 'SIGNATURE_ARCHI') {
                eventTitle = `Signature architecte - Dossier ${dossier.client}`;
              } else if (dossier.etape === 'ATTENTE_PIECE') {
                eventTitle = `Relance pièces - Dossier ${dossier.client}`;
              } else {
                eventTitle = `Échéance dossier ${dossier.client}`;
              }
            
              return (
                <div key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${dossier.priority === 'high' ? 'bg-red-500' : dossier.priority === 'normal' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{eventTitle}</p>
                      <p className="text-xs text-gray-500">Client: {dossier.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-4">{dossier.deadline ? formatDate(dossier.deadline) : ''}</span>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}