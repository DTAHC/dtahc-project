import React, { useState } from 'react';
import { 
  Search, Filter, ChevronDown, ChevronRight, Download, 
  Plus, Edit, Eye, FileText, DollarSign, Calendar, 
  Clock, ArrowUpRight, ArrowDownRight, CheckCircle, 
  XCircle, AlertCircle, Mail, Check, LayoutDashboard,
  Users, Calculator, Settings, MessageSquare, Home
} from 'lucide-react';

const TableauGestionComptable = () => {
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tous');
  const [periodFilter, setPeriodFilter] = useState('mai-2025');
  const [typeClientFilter, setTypeClientFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Données des clients (simulation)
  const clients = [
    {
      id: 'CL-2025-042',
      nom: 'Dupont Jean',
      pro: 'PARTICULIER',
      total: '950.00',
      acompte: '285.00',
      solde: '665.00',
      statut: 'ACOMPTE VERSÉ',
      dernierPaiement: '12/04/2025',
      dateProchainePaiement: '12/05/2025',
      devis: 'DEV-2025-042',
      facture: 'FAC-2025-042',
      methode: 'Virement bancaire',
      alerte: false
    },
    {
      id: 'CL-2025-043',
      nom: 'Martin Sophie',
      pro: 'MDT ANTONY',
      total: '1850.00',
      acompte: '555.00',
      solde: '1295.00',
      statut: 'ACOMPTE VERSÉ',
      dernierPaiement: '10/04/2025',
      dateProchainePaiement: '10/05/2025',
      devis: 'DEV-2025-043',
      facture: 'FAC-2025-043',
      methode: 'Chèque',
      alerte: false
    },
    {
      id: 'CL-2025-044',
      nom: 'Dubois Pierre',
      pro: 'COMBLE DF',
      total: '2400.00',
      acompte: '720.00',
      solde: '1680.00',
      statut: 'RETARD PAIEMENT',
      dernierPaiement: '15/03/2025',
      dateProchainePaiement: '15/04/2025',
      devis: 'DEV-2025-044',
      facture: 'FAC-2025-044',
      methode: 'Virement bancaire',
      alerte: true
    },
    {
      id: 'CL-2025-045',
      nom: 'Lefebvre Marie',
      pro: 'PARTICULIER',
      total: '1200.00',
      acompte: '360.00',
      solde: '840.00',
      statut: 'PAYÉ INTÉGRAL',
      dernierPaiement: '05/04/2025',
      dateProchainePaiement: '-',
      devis: 'DEV-2025-045',
      facture: 'FAC-2025-045',
      methode: 'Carte bancaire',
      alerte: false
    },
    {
      id: 'CL-2025-046',
      nom: 'Bernard Thomas',
      pro: 'PARTICULIER',
      total: '750.00',
      acompte: '0.00',
      solde: '750.00',
      statut: 'EN ATTENTE',
      dernierPaiement: '-',
      dateProchainePaiement: '20/05/2025',
      devis: 'DEV-2025-046',
      facture: '-',
      methode: '-',
      alerte: true
    },
    {
      id: 'CL-2025-047',
      nom: 'Moreau Laurent',
      pro: 'ARCADIA',
      total: '3200.00',
      acompte: '960.00',
      solde: '2240.00',
      statut: 'ACOMPTE VERSÉ',
      dernierPaiement: '18/04/2025',
      dateProchainePaiement: '18/05/2025',
      devis: 'DEV-2025-047',
      facture: 'FAC-2025-047',
      methode: 'Virement bancaire',
      alerte: false
    }
  ];

  // Données financières
  const financeData = {
    chiffreAffairesTotalHT: '10350.00',
    acomptesPercus: '2880.00',
    soldesPercus: '840.00',
    enAttente: '6630.00',
    tauxRecouvrement: 35.94
  };

  // Filtrer les clients
  const filteredClients = clients.filter(client => {
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = 
        client.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
        client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.devis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.facture && client.facture.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    const matchesStatus = statusFilter === 'tous' || 
      (statusFilter === 'en-attente' && client.statut === 'EN ATTENTE') ||
      (statusFilter === 'acompte-verse' && client.statut === 'ACOMPTE VERSÉ') ||
      (statusFilter === 'paye' && client.statut === 'PAYÉ INTÉGRAL') ||
      (statusFilter === 'retard' && client.statut === 'RETARD PAIEMENT');
      
    const matchesType = typeClientFilter === 'tous' || 
      (typeClientFilter === 'particulier' && client.pro === 'PARTICULIER') ||
      (typeClientFilter === 'pro' && client.pro !== 'PARTICULIER');
      
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Gérer l'expansion des lignes
  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête avec menu optimisé */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">DTAHC</h1>
            <span className="ml-1 text-gray-600 font-medium">Gestion</span>
          </div>
          
          {/* Menu principal optimisé avec icônes */}
          <nav className="flex items-center bg-gray-100 p-1 rounded-lg shadow-sm">
            <a href="#" className="flex flex-col items-center px-4 py-2 rounded-md text-gray-700 hover:bg-white hover:shadow-sm transition-all">
              <LayoutDashboard className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Tableau de Bord</span>
            </a>
            <a href="#" className="flex flex-col items-center px-4 py-2 rounded-md text-gray-700 hover:bg-white hover:shadow-sm transition-all">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Gestion Clients</span>
            </a>
            <a href="#" className="flex flex-col items-center px-4 py-2 rounded-md bg-blue-600 text-white shadow-md">
              <Calculator className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Gestion Comptable</span>
            </a>
            <a href="#" className="flex flex-col items-center px-4 py-2 rounded-md text-gray-700 hover:bg-white hover:shadow-sm transition-all">
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Administration</span>
            </a>
            <a href="#" className="flex flex-col items-center px-4 py-2 rounded-md text-gray-700 hover:bg-white hover:shadow-sm transition-all">
              <MessageSquare className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Modèles Communication</span>
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">Testadmin</span>
            <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded-md">Déconnexion</button>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        {/* Bannière d'en-tête avec fil d'Ariane */}
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <Home size={14} className="mr-1" />
          <a href="#" className="hover:text-blue-600">Accueil</a>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-blue-600 font-medium">Gestion Comptable</span>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6 shadow-md">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gestion Comptable</h1>
              <p className="text-blue-100">Suivi financier et facturation des clients</p>
            </div>
            <div className="flex items-center bg-blue-700/50 px-4 py-2 rounded-lg">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="font-medium">Mai 2025</span>
            </div>
          </div>
        </div>
        
        {/* Cartes de métriques optimisées */}
        <div className="mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Vue d'ensemble financière
              </h2>
              <div className="flex gap-2">
                <button className="text-sm bg-white/20 px-3 py-1 rounded flex items-center hover:bg-white/30">
                  <Eye size={14} className="mr-1" />
                  Détails
                </button>
                <button className="text-sm bg-white/20 px-3 py-1 rounded flex items-center hover:bg-white/30">
                  <Download size={14} className="mr-1" />
                  Rapport
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chiffre d'affaires et Taux de recouvrement */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Chiffre d'affaires</h3>
                  <p className="text-sm text-gray-500">Total HT Mai 2025</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-gray-800 mb-2">{financeData.chiffreAffairesTotalHT} €</div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taux de recouvrement</span>
                  <span className="font-semibold">{financeData.tauxRecouvrement}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full">
                  <div 
                    className="h-3 bg-blue-500 rounded-full" 
                    style={{ width: `${financeData.tauxRecouvrement}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Paiements */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Paiements</h3>
                  <p className="text-sm text-gray-500">Acomptes et soldes</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Acomptes</div>
                  <div className="text-xl font-bold text-gray-800">{financeData.acomptesPercus} €</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+5% ce mois-ci</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Soldes</div>
                  <div className="text-xl font-bold text-gray-800">{financeData.soldesPercus} €</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12% ce mois-ci</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total perçu:</span>
                <span className="font-bold text-green-600">{parseFloat(financeData.acomptesPercus) + parseFloat(financeData.soldesPercus)} €</span>
              </div>
            </div>
            
            {/* En attente et Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Paiements en attente</h3>
                  <p className="text-sm text-gray-500">Soldes à percevoir</p>
                </div>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-amber-600 mb-3">{financeData.enAttente} €</div>
              
              <div className="flex items-center text-sm text-red-600 mb-4">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>3 clients en retard</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Relancer
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-gray-50">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Saisir paiement
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barre de filtres et recherche */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-64 mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg mr-4">
              <select 
                className="bg-transparent py-2 px-3 text-gray-700 text-sm focus:outline-none"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="mai-2025">Mai 2025</option>
                <option value="avril-2025">Avril 2025</option>
                <option value="mars-2025">Mars 2025</option>
                <option value="fevrier-2025">Février 2025</option>
                <option value="janvier-2025">Janvier 2025</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm">
              <Filter size={16} />
              <span>Filtres avancés</span>
            </button>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm gap-2">
              <Download size={16} />
              <span>Exporter</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium gap-2">
              <Plus size={16} />
              <span>Nouvelle facture</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium gap-2">
              <Plus size={16} />
              <span>Nouveau devis</span>
            </button>
          </div>
        </div>
        
        {/* Onglets et filtres */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
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
              onClick={() => setActiveTab('a-facturer')}
              className={`p-4 flex flex-col items-center transition-all ${activeTab === 'a-facturer' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`text-lg font-bold ${activeTab === 'a-facturer' ? 'text-blue-600' : 'text-gray-700'}`}>
                2
              </div>
              <div className="text-sm text-gray-500">À facturer</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('retard')}
              className={`p-4 flex flex-col items-center transition-all ${activeTab === 'retard' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`text-lg font-bold ${activeTab === 'retard' ? 'text-blue-600' : 'text-gray-700'}`}>
                1
              </div>
              <div className="text-sm text-gray-500">En retard</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('solde')}
              className={`p-4 flex flex-col items-center transition-all ${activeTab === 'solde' ? 'bg-blue-50 border-t-2 border-blue-600' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`text-lg font-bold ${activeTab === 'solde' ? 'text-blue-600' : 'text-gray-700'}`}>
                3
              </div>
              <div className="text-sm text-gray-500">Solde en attente</div>
            </button>
          </div>
          
          <div className="p-4 border-t border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setStatusFilter('tous')}
                className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === 'tous' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Tous les statuts
              </button>
              <button 
                onClick={() => setStatusFilter('en-attente')}
                className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === 'en-attente' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
              >
                En attente
              </button>
              <button 
                onClick={() => setStatusFilter('acompte-verse')}
                className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === 'acompte-verse' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Acompte versé
              </button>
              <button 
                onClick={() => setStatusFilter('paye')}
                className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === 'paye' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Payé intégral
              </button>
              <button 
                onClick={() => setStatusFilter('retard')}
                className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === 'retard' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Retard paiement
              </button>
              
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              
              <button 
                onClick={() => setTypeClientFilter('tous')}
                className={`px-3 py-1.5 text-sm rounded-full ${typeClientFilter === 'tous' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Tous types
              </button>
              <button 
                onClick={() => setTypeClientFilter('particulier')}
                className={`px-3 py-1.5 text-sm rounded-full ${typeClientFilter === 'particulier' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Particuliers
              </button>
              <button 
                onClick={() => setTypeClientFilter('pro')}
                className={`px-3 py-1.5 text-sm rounded-full ${typeClientFilter === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}
              >
                Professionnels
              </button>
            </div>
          </div>
          
          {/* Tableau des clients */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pro</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompte</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devis</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <React.Fragment key={client.id}>
                    <tr 
                      className={`hover:bg-blue-50 cursor-pointer ${client.alerte ? 'bg-red-50' : ''}`}
                      onClick={() => toggleExpand(client.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {expandedRow === client.id ? (
                            <ChevronDown size={16} className="text-gray-400 mr-2" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-400 mr-2" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{client.nom}</div>
                            <div className="text-gray-500 text-sm">{client.id}</div>
                          </div>
                          {client.alerte && (
                            <AlertCircle size={16} className="ml-2 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{client.pro}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{client.total} €</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.acompte} €</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.solde} €</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.statut === 'PAYÉ INTÉGRAL' && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            PAYÉ INTÉGRAL
                          </span>
                        )}
                        {client.statut === 'ACOMPTE VERSÉ' && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            ACOMPTE VERSÉ
                          </span>
                        )}
                        {client.statut === 'EN ATTENTE' && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            EN ATTENTE
                          </span>
                        )}
                        {client.statut === 'RETARD PAIEMENT' && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            RETARD PAIEMENT
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.devis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.facture}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1.5 bg-white rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 bg-white rounded-md border border-gray-300 text-blue-600 hover:bg-blue-50">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 bg-white rounded-md border border-gray-300 text-green-600 hover:bg-green-50">
                            <DollarSign size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Ligne détaillée (expansible) */}
                    {expandedRow === client.id && (
                      <tr className="bg-blue-50">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Historique de paiement</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Dernier paiement:</span>
                                  <span className="font-medium">{client.dernierPaiement}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Méthode:</span>
                                  <span className="font-medium">{client.methode}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Prochain paiement:</span>
                                  <span className="font-medium">{client.dateProchainePaiement}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                  <span className="text-gray-600">Montant à payer:</span>
                                  <span className="font-semibold text-blue-600">{client.solde} €</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Documents financiers</h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <div className="flex items-center">
                                    <FileText size={16} className="text-blue-600 mr-2" />
                                    <span>Devis {client.devis}</span>
                                  </div>
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Download size={16} />
                                  </button>
                                </div>
                                {client.facture !== '-' && (
                                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <div className="flex items-center">
                                      <FileText size={16} className="text-green-600 mr-2" />
                                      <span>Facture {client.facture}</span>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800">
                                      <Download size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions rapides</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                                  <Edit size={14} className="mr-1.5" />
                                  <span>Modifier</span>
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                                  <FileText size={14} className="mr-1.5" />
                                  <span>Nouveau devis</span>
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                                  <DollarSign size={14} className="mr-1.5" />
                                  <span>Enregistrer paiement</span>
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                                  <Mail size={14} className="mr-1.5" />
                                  <span>Envoyer relance</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            
            {filteredClients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">Aucun client correspondant</h3>
                <p className="text-gray-500 mt-1">Modifiez vos filtres ou effectuez une nouvelle recherche</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredClients.length}</span> sur <span className="font-medium">{clients.length}</span> résultats
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronRight className="h-5 w-5 transform rotate-180" />
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableauGestionComptable;