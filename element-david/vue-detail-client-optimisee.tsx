import React, { useState } from 'react';
import {
  User, Search, Filter, Eye, Download, Edit, Trash2, 
  MessageSquare, FileText, Phone, Mail, MapPin, 
  Building, ChevronRight, ChevronDown, Plus, CheckCircle,
  AlertCircle, Calendar, Clock, CheckSquare, MessageCircle, 
  List
} from 'lucide-react';

// Composant pour les badges de statut
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-700';
  
  if (status === 'TOP URGENT' || status === 'En attente') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  } else if (status === 'ATTENTE PIÈCE' || status === 'En attente') {
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-700';
  } else if (status === 'Payé' || status === 'Terminée') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

// Composant pour afficher un document
const DocumentItem = ({ document, showActions = true }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all">
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-blue-50 text-blue-600 rounded">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{document.nom}</p>
            <p className="text-xs text-gray-500">{document.type} • {document.taille}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
          {document.categorie}
        </span>
      </div>
      {showActions && (
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{document.date}</span>
          <div className="flex gap-1">
            <button className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
              <Eye size={16} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
              <Download size={16} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Composant pour afficher un dossier
const DossierItem = ({ dossier }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
    <div className="flex justify-between mb-2">
      <h4 className="font-medium text-gray-800">{dossier.reference}</h4>
      <StatusBadge status={dossier.statut} />
    </div>
    <p className="text-sm text-gray-500 mb-2">{dossier.type} • {dossier.etape}</p>
    <p className="text-sm text-gray-600">{dossier.description}</p>
    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
      <span>{dossier.date}</span>
      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
        <Eye size={14} />
        <span>Voir détails</span>
      </button>
    </div>
  </div>
);

// Composant pour une tâche
const TaskItem = ({ task }) => (
  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
    <div className="flex justify-between mb-1">
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded-full border-2 ${task.statut === 'Terminée' ? 'bg-green-100 border-green-500' : 'border-green-500'}`}></span>
        <p className="font-medium text-gray-800">{task.titre}</p>
      </div>
      <StatusBadge status={task.statut} />
    </div>
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-500">Assignée à: {task.assignee}</p>
      <p className="text-xs text-gray-500">Échéance: {task.deadline}</p>
    </div>
  </div>
);

// Composant principal
const VueDetailClient = () => {
  const [activeTab, setActiveTab] = useState('infos');
  const [documentFilter, setDocumentFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Données client
  const clientData = {
    id: 'CL-2025-042',
    nom: 'Dupont Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '123 Rue Principale, 75001 Paris',
    type: 'Particulier',
    creation: '15/04/2025',
    pro: 'PARTICULIER',
    dernierContact: '14/04/2025'
  };
  
  // Dossiers
  const dossiers = [
    { 
      id: 'DOS-001', 
      reference: 'DP-2025-042', 
      type: 'DP FENETRE', 
      etape: 'ÉTUDE APS', 
      statut: 'ATTENTE PIÈCE', 
      date: '12/04/2025',
      mois: '04/2025',
      adresse: '123 Rue Principale, 75001 Paris',
      description: 'Remplacement de fenêtres en façade nord'
    },
    { 
      id: 'DOS-002', 
      reference: 'DP-2025-056', 
      type: 'DP+MUR', 
      etape: 'INITIAL', 
      statut: 'TOP URGENT', 
      date: '15/04/2025',
      mois: '04/2025',
      adresse: '123 Rue Principale, 75001 Paris',
      description: 'Création d\'un mur de clôture et portail'
    }
  ];
  
  // Documents
  const documents = [
    { 
      nom: 'Pièce d\'identité', 
      type: 'PDF', 
      date: '12/04/2025', 
      taille: '1.2 MB', 
      categorie: 'Document client' 
    },
    { 
      nom: 'Justificatif de domicile', 
      type: 'PDF', 
      date: '12/04/2025', 
      taille: '843 KB', 
      categorie: 'Document client' 
    },
    { 
      nom: 'Photos façade actuelle', 
      type: 'JPG', 
      date: '13/04/2025', 
      taille: '3.5 MB', 
      categorie: 'Dossier urbanisme' 
    },
    { 
      nom: 'Plan cadastral', 
      type: 'PDF', 
      date: '14/04/2025', 
      taille: '2.1 MB', 
      categorie: 'Dossier urbanisme' 
    },
    { 
      nom: 'Autorisation travaux', 
      type: 'PDF', 
      date: '15/04/2025', 
      taille: '1.8 MB', 
      categorie: 'Courrier mairie' 
    },
    { 
      nom: 'PLU Local', 
      type: 'PDF', 
      date: '10/04/2025', 
      taille: '4.2 MB', 
      categorie: 'Réglementation' 
    },
    { 
      nom: 'Notes techniques', 
      type: 'DOC', 
      date: '16/04/2025', 
      taille: '780 KB', 
      categorie: 'Autres' 
    }
  ];
  
  // Facturation
  const facturation = [
    { 
      type: 'Devis', 
      reference: 'DEV-2025-042', 
      montant: '950.00 €', 
      date: '10/04/2025',
      mois: '04/2025',
      statut: 'Accepté' 
    },
    { 
      type: 'Facture Acompte', 
      reference: 'FAC-2025-042', 
      montant: '285.00 €', 
      date: '12/04/2025',
      mois: '04/2025',
      statut: 'Payé' 
    },
    { 
      type: 'Facture Solde', 
      reference: 'FAC-2025-056', 
      montant: '665.00 €', 
      date: '25/04/2025',
      mois: '04/2025',
      statut: 'En attente' 
    }
  ];
  
  // Tâches
  const taches = [
    {
      id: 'TASK-001',
      titre: 'Relancer le client pour photos',
      assignee: 'Sophie Martin',
      statut: 'Terminée',
      deadline: '14/04/2025',
      dateCreation: '12/04/2025 10:30'
    },
    {
      id: 'TASK-002',
      titre: 'Envoyer le dossier en mairie',
      assignee: 'Pierre Durand',
      statut: 'En cours',
      deadline: '20/04/2025',
      dateCreation: '15/04/2025 14:15'
    },
    {
      id: 'TASK-003',
      titre: 'Planifier une visite sur place',
      assignee: 'Marie Legrand',
      statut: 'En cours',
      deadline: '22/04/2025',
      dateCreation: '15/04/2025 16:45'
    }
  ];
  
  // Historique
  const historique = [
    { 
      date: '15/04/2025 14:32', 
      action: 'Modification d\'informations client', 
      type: 'action',
      utilisateur: 'Sophie Martin', 
      details: 'Mise à jour du numéro de téléphone' 
    },
    { 
      date: '14/04/2025 16:20', 
      action: 'Note interne ajoutée', 
      type: 'note',
      utilisateur: 'Sophie Martin', 
      details: 'Client préfère être contacté par email plutôt que par téléphone' 
    },
    { 
      date: '14/04/2025 11:45', 
      action: 'Tâche terminée', 
      type: 'tache',
      utilisateur: 'Sophie Martin', 
      details: 'Relancer le client pour photos' 
    },
    { 
      date: '13/04/2025 09:15', 
      action: 'Envoi documents au client', 
      type: 'action',
      utilisateur: 'Pierre Durand', 
      details: 'Envoi du dossier complet par email' 
    },
    { 
      date: '12/04/2025 11:23', 
      action: 'Réception paiement acompte', 
      type: 'action',
      utilisateur: 'Marie Legrand', 
      details: 'Virement bancaire reçu' 
    },
    { 
      date: '10/04/2025 16:48', 
      action: 'Création du dossier', 
      type: 'action',
      utilisateur: 'Sophie Martin', 
      details: 'Initialisation du dossier DP FENETRE' 
    },
    { 
      date: '10/04/2025 16:30', 
      action: 'Création fiche client', 
      type: 'action',
      utilisateur: 'Sophie Martin', 
      details: 'Enregistrement initial des informations client' 
    }
  ];
  
  // Options pour les filtres
  const categories = ['Document client', 'Dossier urbanisme', 'Courrier mairie', 'Réglementation', 'Autres'];
  const membres = ['Sophie Martin', 'Pierre Durand', 'Marie Legrand', 'Thomas Bernard', 'Julie Petit'];
  const mois = ['01/2025', '02/2025', '03/2025', '04/2025', '05/2025'];
  const statuts = {
    dossiers: ['TOUS', 'TOP URGENT', 'ATTENTE PIÈCE', 'EN COURS', 'TERMINÉ'],
    facturation: ['TOUS', 'En attente', 'Payé', 'Accepté', 'Refusé']
  };

  // Filtrage des documents
  const filteredDocuments = documentFilter 
    ? documents.filter(doc => doc.categorie === documentFilter) 
    : documents;
  
  // Filtrage des dossiers
  const filteredDossiers = dossiers.filter(dossier => {
    if (selectedMonth && dossier.mois !== selectedMonth) return false;
    if (selectedStatus && selectedStatus !== 'TOUS' && dossier.statut !== selectedStatus) return false;
    return true;
  });
  
  // Filtrage de la facturation
  const filteredFacturation = facturation.filter(item => {
    if (selectedMonth && item.mois !== selectedMonth) return false;
    if (selectedStatus && selectedStatus !== 'TOUS' && item.statut !== selectedStatus) return false;
    return true;
  });

  // Calcul des totaux financiers
  const totalMontant = facturation.reduce((sum, item) => sum + parseFloat(item.montant), 0);
  const totalPaye = facturation
    .filter(item => item.statut === 'Payé')
    .reduce((sum, item) => sum + parseFloat(item.montant), 0);
  const totalRestant = totalMontant - totalPaye;
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Clients</span>
            <ChevronRight size={16} />
            <span className="text-blue-500">Fiche détaillée</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            {clientData.nom}
            <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              {clientData.id}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Envoyer un message</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
            <Edit size={16} />
            <span>Modifier</span>
          </button>
        </div>
      </div>
      
      {/* Informations principales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
              {clientData.nom.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{clientData.nom}</h2>
              <p className="text-gray-500">{clientData.type} • Créé le {clientData.creation}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100 min-w-[120px]">
              <span className="text-sm text-green-600 font-medium">Dossiers</span>
              <span className="text-2xl font-semibold text-green-700">{dossiers.length}</span>
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
                <span className="text-gray-600">{clientData.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-600">{clientData.telephone}</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-600">{clientData.adresse}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-3 border-b pb-2">Informations complémentaires</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-600">Pro associé: {clientData.pro}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-600">Date de création: {clientData.creation}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-600">Dernier contact: {clientData.dernierContact}</span>
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
                  {filteredDossiers.map(dossier => (
                    <DossierItem key={dossier.id} dossier={dossier} />
                  ))}
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
                  {documents.slice(0, 3).map((doc, index) => (
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
                  ))}
                  
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
                    {taches.slice(0, 2).map((tache, index) => (
                      <TaskItem key={index} task={tache} />
                    ))}
                    <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2">
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
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-700">
                  <Plus size={16} />
                  <span>Nouveau dossier</span>
                </button>
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
                    {filteredDossiers.map(dossier => (
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
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={18} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc, index) => (
                  <DocumentItem key={index} document={doc} />
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
                    {filteredFacturation.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
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
                    <p className="text-lg font-semibold text-gray-800">950.00 €</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Acompte versé</p>
                    <p className="text-lg font-semibold text-green-600">285.00 €</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Solde restant</p>
                    <p className="text-lg font-semibold text-amber-600">665.00 €</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">État paiement</p>
                    <p className="text-sm font-medium mt-1">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Acompte versé
                      </span>
                    </p>
                  </div>
                </div>
              </div>
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
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3" 
                    rows="3"
                    placeholder="Saisir votre note..."
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button 
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600"
                      onClick={() => setShowNewNoteForm(false)}
                    >
                      Annuler
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md">
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
              
              {/* Formulaire d'ajout de tâche */}
              {showNewTaskForm && (
                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="text-sm font-medium text-green-700 mb-3">Créer une nouvelle tâche</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Titre de la tâche</label>
                      <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Description</label>
                      <textarea className="w-full p-2 border border-gray-300 rounded-lg" rows="2"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm mb-1">Assignée à</label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                          {membres.map((membre, index) => (
                            <option key={index} value={membre}>{membre}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Date d'échéance</label>
                        <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600"
                        onClick={() => setShowNewTaskForm(false)}
                      >
                        Annuler
                      </button>
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded-md">
                        Créer la tâche
                      </button>
                    </div>
                  </div>
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
                  {taches.filter(t => t.statut !== 'Terminée').map((tache, index) => (
                    <TaskItem key={index} task={tache} />
                  ))}
                </div>
              </div>
              
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VueDetailClient;