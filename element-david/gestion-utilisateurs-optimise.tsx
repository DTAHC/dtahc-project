import React, { useState } from 'react';
import {
  Search, Plus, Filter, Edit, Trash2, CheckCircle,
  XCircle, Mail, Phone, Shield, Settings, User,
  Eye, EyeOff, Clock, Users, UserPlus, Lock, Unlock,
  Calendar, ArrowLeft, ArrowRight, Bell, MessageSquare,
  AlertCircle, Info, X
} from 'lucide-react';

const GestionUtilisateurs = () => {
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [roleFilter, setRoleFilter] = useState('tous');
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  
  // Données utilisateurs
  const utilisateurs = [
    {
      id: 'USR-001',
      nom: 'Dupont Jean',
      email: 'jean.dupont@dtahc.fr',
      role: 'Admin',
      statut: 'Actif',
      derniere_connexion: '16/05/2025 10:23',
      permissions: ['tous']
    },
    {
      id: 'USR-002',
      nom: 'Martin Sophie',
      email: 'sophie.martin@dtahc.fr',
      role: 'Comptable',
      statut: 'Actif',
      derniere_connexion: '16/05/2025 09:45',
      permissions: ['comptabilite', 'clients', 'tableau_bord']
    },
    {
      id: 'USR-003',
      nom: 'Bernard Thomas',
      email: 'thomas.bernard@dtahc.fr',
      role: 'Gestion',
      statut: 'Actif',
      derniere_connexion: '15/05/2025 16:32',
      permissions: ['clients', 'tableau_bord', 'modeles']
    },
    {
      id: 'USR-004',
      nom: 'Petit Julie',
      email: 'julie.petit@dtahc.fr',
      role: 'Production',
      statut: 'Actif',
      derniere_connexion: '15/05/2025 14:17',
      permissions: ['clients', 'tableau_bord']
    },
    {
      id: 'USR-005',
      nom: 'Lefebvre Marc',
      email: 'marc.lefebvre@construires.fr',
      role: 'Client Pro',
      statut: 'Actif',
      derniere_connexion: '14/05/2025 11:05',
      permissions: ['clients_limite', 'tableau_bord_limite']
    },
    {
      id: 'USR-006',
      nom: 'Morel Michel',
      email: 'michel.morel@dtahc.fr',
      role: 'Production',
      statut: 'Inactif',
      derniere_connexion: '01/03/2025 09:22',
      permissions: ['clients', 'tableau_bord']
    }
  ];
  
  // Logs d'activité récentes
  const activiteLogs = [
    { utilisateur: 'Dupont Jean', action: 'Connexion au système', date: '16/05/2025 10:23' },
    { utilisateur: 'Martin Sophie', action: 'Créé une nouvelle facture', date: '16/05/2025 10:15' },
    { utilisateur: 'Dupont Jean', action: 'Modifié les paramètres du système', date: '16/05/2025 09:58' },
    { utilisateur: 'Martin Sophie', action: 'Connexion au système', date: '16/05/2025 09:45' },
    { utilisateur: 'Bernard Thomas', action: 'Ajouté un nouveau client', date: '15/05/2025 17:21' },
    { utilisateur: 'Bernard Thomas', action: 'Connexion au système', date: '15/05/2025 16:32' },
    { utilisateur: 'Petit Julie', action: 'Téléchargé un document cadastral', date: '15/05/2025 15:04' },
    { utilisateur: 'Petit Julie', action: 'Connexion au système', date: '15/05/2025 14:17' }
  ];
  
  // Filtrer les utilisateurs
  const filteredUsers = utilisateurs.filter(user => {
    // Filtrer par recherche
    const matchesSearch = searchQuery === '' || 
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par statut
    const matchesStatus = statusFilter === 'tous' || 
      (statusFilter === 'actifs' && user.statut === 'Actif') ||
      (statusFilter === 'inactifs' && user.statut === 'Inactif');
    
    // Filtrer par rôle
    const matchesRole = roleFilter === 'tous' || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Afficher une notification toast
  const showNotification = (type) => {
    const toastMessages = {
      success: "Opération réussie! L'utilisateur a été mis à jour.",
      error: "Erreur! Impossible de traiter votre demande.",
      warning: "Attention! Cette action nécessite une confirmation.",
      info: "Information: De nouvelles fonctionnalités sont disponibles."
    };

    setShowToast({
      type: type,
      message: toastMessages[type]
    });

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">DTAHC</h1>
            <span className="ml-1 text-gray-600 font-medium">Gestion</span>
          </div>
          
          <nav className="flex space-x-8">
            <a href="#" className="px-1 py-4 text-sm text-gray-600 border-b-2 border-transparent hover:text-gray-800">Tableau de bord</a>
            <a href="#" className="px-1 py-4 text-sm text-gray-600 border-b-2 border-transparent hover:text-gray-800">Clients</a>
            <a href="#" className="px-1 py-4 text-sm text-gray-600 border-b-2 border-transparent hover:text-gray-800">Comptabilité</a>
            <a href="#" className="px-1 py-4 text-sm text-blue-600 border-b-2 border-blue-500 font-medium">Administration</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">Admin</span>
            <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded-md">Déconnexion</button>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        {/* En-tête avec titre */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="text-gray-500">Gérez les comptes, les rôles et les permissions des utilisateurs</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
              onClick={() => setShowAddUserModal(true)}
            >
              <UserPlus size={16} />
              <span>Nouvel utilisateur</span>
            </button>
          </div>
        </div>
        
        {/* Démonstration Toast */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Démonstration du système de notifications</h2>
          
          <p className="text-sm text-gray-600 mb-4">Cliquez sur les boutons ci-dessous pour voir les différents types de notifications</p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => showNotification('success')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
            >
              Succès
            </button>
            
            <button
              onClick={() => showNotification('error')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
            >
              Erreur
            </button>
            
            <button
              onClick={() => showNotification('warning')}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
            >
              Avertissement
            </button>
            
            <button
              onClick={() => showNotification('info')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Information
            </button>
          </div>
        </div>
        
        {/* Barre d'onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button 
                className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'utilisateurs' ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('utilisateurs')}
              >
                Utilisateurs
              </button>
              <button 
                className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'roles' ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('roles')}
              >
                Rôles et permissions
              </button>
              <button 
                className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'activite' ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('activite')}
              >
                Journal d'activité
              </button>
              <button 
                className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'parametres' ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('parametres')}
              >
                Paramètres
              </button>
              <a 
                href="/administration/facturation" 
                className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300"
              >
                Facturation
              </a>
              <a 
                href="/administration/sources-externes" 
                className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300"
              >
                Sources externes
              </a>
            </nav>
          </div>
        </div>
        
        {/* Contenu de l'onglet Utilisateurs */}
        {activeTab === 'utilisateurs' && (
          <div className="space-y-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex-grow max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="flex items-center flex-wrap gap-3">
                <select 
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="actifs">Actifs uniquement</option>
                  <option value="inactifs">Inactifs uniquement</option>
                </select>
                
                <select 
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="tous">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="comptable">Comptable</option>
                  <option value="gestion">Gestion</option>
                  <option value="production">Production</option>
                  <option value="client pro">Client Pro</option>
                </select>
                
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm flex items-center gap-2">
                  <Filter size={16} />
                  <span>Plus de filtres</span>
                </button>
              </div>
            </div>
            
            {/* Tableau des utilisateurs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {user.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                              <div className="text-xs text-gray-500">{user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                             user.role === 'Comptable' ? 'bg-yellow-100 text-yellow-800' : 
                             user.role === 'Gestion' ? 'bg-blue-100 text-blue-800' : 
                             user.role === 'Production' ? 'bg-green-100 text-green-800' : 
                             'bg-gray-100 text-gray-800'}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.statut === 'Actif' ? 
                              <><CheckCircle size={12} className="mr-1" /> Actif</> : 
                              <><XCircle size={12} className="mr-1" /> Inactif</>
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            {user.derniere_connexion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              className="p-1 rounded-md border border-gray-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => showNotification('info')}
                            >
                              <Edit size={16} />
                            </button>
                            {user.statut === 'Actif' ? (
                              <button 
                                className="p-1 rounded-md border border-gray-300 text-amber-600 hover:bg-amber-50"
                                onClick={() => showNotification('warning')}
                              >
                                <Lock size={16} />
                              </button>
                            ) : (
                              <button 
                                className="p-1 rounded-md border border-gray-300 text-green-600 hover:bg-green-50"
                                onClick={() => showNotification('success')}
                              >
                                <Unlock size={16} />
                              </button>
                            )}
                            <button 
                              className="p-1 rounded-md border border-gray-300 text-red-600 hover:bg-red-50"
                              onClick={() => showNotification('error')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche ou d'ajouter un nouvel utilisateur.</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium inline-flex items-center gap-2"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    <UserPlus size={16} />
                    <span>Nouvel utilisateur</span>
                  </button>
                </div>
              )}
              
              {filteredUsers.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredUsers.length}</span> sur <span className="font-medium">{utilisateurs.length}</span> utilisateurs
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white flex items-center">
                      <ArrowLeft size={14} className="mr-1" />
                      <span>Précédent</span>
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white flex items-center">
                      <span>Suivant</span>
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Contenu de l'onglet Rôles et permissions */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Rôles du système</h2>
                <p className="text-sm text-gray-500 mt-1">Configuration des rôles et des permissions associées</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Admin */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-purple-50 border-b border-purple-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield size={20} className="text-purple-700 mr-2" />
                      <div>
                        <h3 className="font-medium text-purple-900">Administrateur</h3>
                        <p className="text-xs text-purple-800">Accès complet au système</p>
                      </div>
                    </div>
                    <div>
                      <button className="text-purple-700 hover:text-purple-900 text-sm">Modifier</button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tableau de bord</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Vue complète</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Créer des dossiers</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Modifier des dossiers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Gestion clients</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Vue complète</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Créer des clients</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Modifier des clients</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Administration</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Gestion utilisateurs</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Paramètres système</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Configuration avancée</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comptable */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield size={20} className="text-yellow-700 mr-2" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Comptable</h3>
                        <p className="text-xs text-yellow-800">Accès à la gestion financière</p>
                      </div>
                    </div>
                    <div>
                      <button className="text-yellow-700 hover:text-yellow-900 text-sm">Modifier</button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tableau de bord</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Vue restreinte</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Visualiser les dossiers</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" disabled />
                          <span className="text-sm text-gray-600">Modifier des dossiers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Gestion clients</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Vue complète</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Créer des clients</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" disabled />
                          <span className="text-sm text-gray-600">Modifier les dossiers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Comptabilité</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Vue complète</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Créer factures/devis</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" checked disabled />
                          <span className="text-sm text-gray-600">Enregistrer paiements</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Ajouter un nouveau rôle */}
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Shield size={32} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-base font-medium text-gray-700 mb-2">Ajouter un nouveau rôle</h3>
                  <p className="text-sm text-gray-500 mb-4">Créez un rôle personnalisé avec des permissions spécifiques</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => showNotification('info')}
                  >
                    Créer un rôle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu de l'onglet Journal d'activité */}
        {activeTab === 'activite' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Journal d'activité des utilisateurs</h2>
                <p className="text-sm text-gray-500 mt-1">Historique des actions réalisées dans le système</p>
              </div>
              
              <div className="p-6">
                {/* Filtres du journal */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex-grow max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher une activité..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-auto gap-3">
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <select className="bg-transparent border-0 focus:outline-none text-sm text-gray-700">
                        <option>Aujourd'hui</option>
                        <option>Hier</option>
                        <option>7 derniers jours</option>
                        <option>30 derniers jours</option>
                        <option>Personnalisé...</option>
                      </select>
                    </div>
                    
                    <select className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Toutes les actions</option>
                      <option>Connexions</option>
                      <option>Création</option>
                      <option>Modification</option>
                      <option>Suppression</option>
                    </select>
                  </div>
                </div>
                
                {/* Liste des activités */}
                <div className="space-y-4">
                  {activiteLogs.map((log, index) => (
                    <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-4">
                        {log.utilisateur.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{log.utilisateur}</p>
                            <p className="text-gray-700">{log.action}</p>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {log.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    Afficher plus d'activités
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu de l'onglet Paramètres */}
        {activeTab === 'parametres' && (
          <div className="space-y-6">
            {/* Paramètres de notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Paramètres de notifications</h2>
                <p className="text-sm text-gray-500 mt-1">Configuration des notifications systèmes</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-4">Notifications email</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notifications par email</p>
                          <p className="text-xs text-gray-500">Envoyer des notifications par email aux utilisateurs</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notifications nouveaux dossiers</p>
                          <p className="text-xs text-gray-500">Alerter les utilisateurs des nouveaux dossiers</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notifications d'échéances</p>
                          <p className="text-xs text-gray-500">Alerter des échéances proches</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Relances automatiques</p>
                          <p className="text-xs text-gray-500">Envoyer des relances automatiques</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" />
                          <span className="block w-6 h-6 bg-white rounded-full shadow-md transform"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-4">Notifications système</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Alertes dans l'application</p>
                          <p className="text-xs text-gray-500">Afficher des alertes dans l'interface</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notifications de connexion</p>
                          <p className="text-xs text-gray-500">Alerter lors des nouvelles connexions</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notifications de modification</p>
                          <p className="text-xs text-gray-500">Alerter lors des modifications de dossiers</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" />
                          <span className="block w-6 h-6 bg-white rounded-full shadow-md transform"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Alertes de sécurité</p>
                          <p className="text-xs text-gray-500">Notifications pour les événements de sécurité</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="block w-6 h-6 bg-blue-600 rounded-full shadow-md transform translate-x-6"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => showNotification('success')}
                  >
                    Enregistrer les paramètres
                  </button>
                </div>
              </div>
            </div>
            
            {/* Configuration des relances */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Configuration des relances automatiques</h2>
                <p className="text-sm text-gray-500 mt-1">Paramètres des relances pour les clients</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Délai avant première relance</h3>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        defaultValue="3" 
                        min="1" 
                        max="30" 
                        className="w-20 text-center border border-gray-300 rounded-md p-2 mr-2" 
                      />
                      <select className="border border-gray-300 rounded-md p-2">
                        <option value="jours">jours</option>
                        <option value="semaines">semaines</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Fréquence des relances</h3>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        defaultValue="7" 
                        min="1" 
                        max="30" 
                        className="w-20 text-center border border-gray-300 rounded-md p-2 mr-2" 
                      />
                      <select className="border border-gray-300 rounded-md p-2">
                        <option value="jours">jours</option>
                        <option value="semaines">semaines</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Nombre maximum de relances</h3>
                    <input 
                      type="number" 
                      defaultValue="3" 
                      min="1" 
                      max="10" 
                      className="w-20 text-center border border-gray-300 rounded-md p-2" 
                    />
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Modèle d'email de relance</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Objet de l'email</label>
                      <input
                        type="text"
                        defaultValue="RAPPEL : Documents en attente pour votre dossier {REFERENCE}"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Corps du message</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md h-32"
                        defaultValue="Bonjour {NOM_CLIENT},

Nous vous rappelons que nous attendons toujours les documents suivants pour votre dossier {REFERENCE} :
{LISTE_DOCUMENTS}

Merci de nous les faire parvenir dans les meilleurs délais afin que nous puissions poursuivre le traitement de votre dossier.

Cordialement,
L'équipe DTAHC"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm">
                        Aperçu
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm">
                        Variables disponibles
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => showNotification('success')}
                  >
                    Enregistrer la configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Les onglets Facturation et Sources Externes ont été retirés car ils ont des pages dédiées */}
      </main>
      
      {/* Modal d'ajout d'utilisateur */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ajouter un utilisateur</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <input
                  type="email"
                  placeholder="jean.dupont@example.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="admin">Administrateur</option>
                  <option value="comptable">Comptable</option>
                  <option value="gestion">Gestion</option>
                  <option value="production">Production</option>
                  <option value="client_pro">Client Pro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Au moins 8 caractères avec majuscules, chiffres et symboles</p>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="send-email" className="mr-2" />
                <label htmlFor="send-email" className="text-sm text-gray-700">Envoyer un email d'invitation</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                onClick={() => setShowAddUserModal(false)}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => {
                  setShowAddUserModal(false);
                  showNotification('success');
                }}
              >
                Ajouter l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slideIn
          ${showToast.type === 'success' ? 'bg-green-100 text-green-800' : 
           showToast.type === 'error' ? 'bg-red-100 text-red-800' : 
           showToast.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
           'bg-blue-100 text-blue-800'}`}
        >
          {showToast.type === 'success' && <CheckCircle size={20} />}
          {showToast.type === 'error' && <AlertCircle size={20} />}
          {showToast.type === 'warning' && <AlertCircle size={20} />}
          {showToast.type === 'info' && <Info size={20} />}
          <span>{showToast.message}</span>
          <button 
            className="ml-2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GestionUtilisateurs;
