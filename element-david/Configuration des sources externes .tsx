import React, { useState } from 'react';
import {
  Sliders, Database, Globe, Key, BarChart2, Lock, RefreshCw, CheckCircle,
  AlertCircle, Info, Save, Check, X, Play, Pause, Server, FileText, Settings,
  HelpCircle, Download, Upload, Layers, Network
} from 'lucide-react';

export default function ConfigurationSources() {
  const [activeTab, setActiveTab] = useState('cadastre');
  const [apiStatus, setApiStatus] = useState({
    cadastre: 'online', // online, offline, maintenance
    plu: 'online',
    cerfa: 'online',
    faisabilite: 'offline'
  });
  
  // États pour les formulaires
  const [cadastreForm, setCadastreForm] = useState({
    apiUrl: 'https://api.cadastre.gouv.fr/v1',
    apiKey: '•••••••••••••••••••••',
    refreshRate: 'daily',
    autoDownload: true,
    savePath: '/donnees/cadastre',
    timeout: 30
  });
  
  const [pluForm, setPluForm] = useState({
    apiUrl: 'https://plu.urbanisme.gouv.fr/api',
    serviceId: 'DTAHC-URBA-2025',
    refreshRate: 'weekly',
    autoUpdate: true,
    cacheDuration: 30
  });
  
  const [testLoading, setTestLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState(null);
  
  // Fonction pour tester la connexion
  const testConnection = (type) => {
    setTestLoading(true);
    
    // Simuler un appel API
    setTimeout(() => {
      // Simuler une réponse aléatoire réussie ou échouée
      const success = Math.random() > 0.3;
      setTestSuccess(success);
      setTestLoading(false);
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setTestSuccess(null);
      }, 3000);
    }, 2000);
  };
  
  // Fonction pour obtenir les stats d'utilisation
  const getUsageStats = (type) => {
    switch (type) {
      case 'cadastre':
        return {
          requestsThisMonth: 845,
          quota: 1000,
          averageResponseTime: '1.2s',
          successRate: 99.2
        };
      case 'plu':
        return {
          requestsThisMonth: 312,
          quota: 500,
          averageResponseTime: '2.3s',
          successRate: 98.4
        };
      case 'cerfa':
        return {
          requestsThisMonth: 178,
          quota: 'Illimité',
          averageResponseTime: '0.8s',
          successRate: 100
        };
      default:
        return {
          requestsThisMonth: 0,
          quota: 0,
          averageResponseTime: '0s',
          successRate: 0
        };
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Configuration des sources externes</h1>
          <p className="text-gray-500">Configurez les accès aux APIs et services externes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50">
            Annuler
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
            <Save size={16} />
            <span>Enregistrer tout</span>
          </button>
        </div>
      </div>
      
      {/* Statut des API */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">État des services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-blue-500" />
                <span className="font-medium text-gray-700">API Cadastre</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus.cadastre === 'online' ? 'bg-green-100 text-green-700' :
                apiStatus.cadastre === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {apiStatus.cadastre === 'online' ? 'En ligne' :
                 apiStatus.cadastre === 'maintenance' ? 'Maintenance' :
                 'Hors ligne'}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Dernière vérification: 16/05/2025 10:24</span>
              <button className="text-blue-600 hover:text-blue-800">Détails</button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-green-500" />
                <span className="font-medium text-gray-700">API PLU</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus.plu === 'online' ? 'bg-green-100 text-green-700' :
                apiStatus.plu === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {apiStatus.plu === 'online' ? 'En ligne' :
                 apiStatus.plu === 'maintenance' ? 'Maintenance' :
                 'Hors ligne'}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Dernière vérification: 16/05/2025 10:24</span>
              <button className="text-blue-600 hover:text-blue-800">Détails</button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-purple-500" />
                <span className="font-medium text-gray-700">Générateur CERFA</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus.cerfa === 'online' ? 'bg-green-100 text-green-700' :
                apiStatus.cerfa === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {apiStatus.cerfa === 'online' ? 'En ligne' :
                 apiStatus.cerfa === 'maintenance' ? 'Maintenance' :
                 'Hors ligne'}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Dernière vérification: 16/05/2025 10:24</span>
              <button className="text-blue-600 hover:text-blue-800">Détails</button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-red-500" />
                <span className="font-medium text-gray-700">Analyse Faisabilité</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus.faisabilite === 'online' ? 'bg-green-100 text-green-700' :
                apiStatus.faisabilite === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {apiStatus.faisabilite === 'online' ? 'En ligne' :
                 apiStatus.faisabilite === 'maintenance' ? 'Maintenance' :
                 'Hors ligne'}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Dernière vérification: 16/05/2025 10:24</span>
              <button className="text-blue-600 hover:text-blue-800">Détails</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'cadastre' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('cadastre')}
            >
              <Database size={16} />
              Configuration Cadastre
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'plu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('plu')}
            >
              <Globe size={16} />
              Configuration PLU
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'cerfa' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('cerfa')}
            >
              <FileText size={16} />
              Configuration CERFA
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'logs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('logs')}
            >
              <Server size={16} />
              Logs & Diagnostics
            </button>
          </nav>
        </div>
      </div>
      
      {/* Contenu des onglets */}
      <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 p-6 mb-6">
        {/* Cadastre */}
        {activeTab === 'cadastre' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Configuration de l'API Carto (IGN) - Module Cadastre</h2>
                <p className="text-gray-600">Paramètres de connexion à l'API Carto de l'IGN pour la récupération automatique des plans cadastraux et des informations parcellaires.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  apiStatus.cadastre === 'online' ? 'bg-green-100 text-green-700' :
                  apiStatus.cadastre === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {apiStatus.cadastre === 'online' ? 
                    <><CheckCircle size={14} /> En ligne</> :
                    apiStatus.cadastre === 'maintenance' ? 
                    <><AlertCircle size={14} /> Maintenance</> :
                    <><X size={14} /> Hors ligne</>
                  }
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm mb-2">
                    L'API Carto de l'IGN permet l'extraction automatique des données cadastrales. Cette intégration simplifie la récupération des plans et des informations cadastrales en quelques clics.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="col-span-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cadastre-url">
                      URL API Carto Cadastre
                    </label>
                    <input
                      id="cadastre-url"
                      type="text"
                      value="https://apicarto.ign.fr/api/cadastre"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">URL officielle de l'API Carto module cadastre - ne pas modifier</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Méthodes d'extraction disponibles</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                        <div className="mt-1">
                          <input
                            id="method-reference"
                            name="extraction-method"
                            type="radio"
                            defaultChecked
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="method-reference" className="text-sm font-medium text-gray-700">
                            Extraction par références cadastrales
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Récupération des données à partir du code INSEE, section et numéro de parcelle
                          </p>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            <div>
                              <label className="block text-xs text-gray-500">Code INSEE</label>
                              <input type="text" placeholder="Ex: 94067" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Section</label>
                              <input type="text" placeholder="Ex: AB" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Numéro</label>
                              <input type="text" placeholder="Ex: 0123" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                        <div className="mt-1">
                          <input
                            id="method-coordinates"
                            name="extraction-method"
                            type="radio"
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="method-coordinates" className="text-sm font-medium text-gray-700">
                            Extraction par coordonnées géographiques
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Récupération des données à partir de coordonnées WGS84 (longitude/latitude)
                          </p>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <div>
                              <label className="block text-xs text-gray-500">Longitude</label>
                              <input type="text" placeholder="Ex: 2.41802" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Latitude</label>
                              <input type="text" placeholder="Ex: 48.81547" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <input
                            id="method-address"
                            name="extraction-method"
                            type="radio"
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="method-address" className="text-sm font-medium text-gray-700">
                            Extraction par adresse
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Géocodage de l'adresse et récupération automatique des données cadastrales
                          </p>
                          <div className="mt-2">
                            <input type="text" placeholder="Saisir l'adresse complète" className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Options de génération des plans</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-blue-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Plan de situation 1:3500</span>
                            <p className="text-xs text-gray-500">Génération automatique avec environnement</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-blue-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Plan de masse 1:500</span>
                            <p className="text-xs text-gray-500">Plan détaillé de la parcelle</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-blue-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Extraire données de contenance</span>
                            <p className="text-xs text-gray-500">Surface, périmètre et dimensions</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-blue-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Récupérer les localisants</span>
                            <p className="text-xs text-gray-500">Points d'adresse et numéros de voirie</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cadastre-refresh">
                        Fréquence de mise à jour du cache
                      </label>
                      <select
                        id="cadastre-refresh"
                        value={cadastreForm.refreshRate}
                        onChange={(e) => setCadastreForm({...cadastreForm, refreshRate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="hourly">Toutes les heures</option>
                        <option value="daily">Tous les jours</option>
                        <option value="weekly">Toutes les semaines</option>
                        <option value="monthly">Tous les mois</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cadastre-path">
                        Répertoire de stockage des plans
                      </label>
                      <input
                        id="cadastre-path"
                        type="text"
                        value={cadastreForm.savePath}
                        onChange={(e) => setCadastreForm({...cadastreForm, savePath: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => testConnection('cadastre')}
                        disabled={testLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                          testLoading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 
                          'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {testLoading ? <RefreshCw size={16} className="animate-spin" /> : 
                         testSuccess === true ? <CheckCircle size={16} /> :
                         testSuccess === false ? <AlertCircle size={16} /> :
                         <Network size={16} />}
                        <span>
                          {testLoading ? 'Test en cours...' : 
                           testSuccess === true ? 'Connexion réussie' :
                           testSuccess === false ? 'Échec de connexion' :
                           'Tester la connexion à l\'API'}
                        </span>
                      </button>
                      
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                        <RefreshCw size={16} />
                        <span>Vérifier les mises à jour</span>
                      </button>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
                      <Save size={16} />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BarChart2 size={16} className="text-blue-500" />
                    Statistiques d'utilisation
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Requêtes ce mois-ci</span>
                        <span className="text-xs font-medium text-gray-700">{getUsageStats('cadastre').requestsThisMonth}/{getUsageStats('cadastre').quota}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(getUsageStats('cadastre').requestsThisMonth / getUsageStats('cadastre').quota) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Temps de réponse moyen</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('cadastre').averageResponseTime}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Taux de succès</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('cadastre').successRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Dernière mise à jour</span>
                      <span className="text-sm font-medium text-gray-800">16/05/2025 10:24</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 mt-4">
                  <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Informations sur l'API Carto
                  </h3>
                  
                  <p className="text-xs text-blue-600 mb-2">
                    L'API Carto de l'IGN permet d'accéder aux données cadastrales et géographiques officielles de France.
                  </p>
                  
                  <ul className="text-xs text-blue-600 list-disc pl-4 space-y-1">
                    <li>Mise à disposition par l'Institut National de l'Information Géographique</li>
                    <li>Données cadastrales officielles</li>
                    <li>Format GeoJSON WGS84</li>
                    <li>Pas de clé API requise pour le module cadastre</li>
                    <li>Limite de 1000 objets par requête</li>
                  </ul>
                  
                  <div className="mt-2">
                    <a href="https://apicarto.ign.fr/api/doc/cadastre" target="_blank" className="text-xs text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Documentation officielle de l'API</span>
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Database size={16} className="text-blue-500" />
                    Exemple de données récupérées
                  </h3>
                  
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                    {`{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "code_insee": "94067",
      "section": "AB",
      "numero": "0123",
      "contenance": 450,
      "nom_com": "Saint-Maur-des-Fossés"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [...]
    }
  }]
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* PLU - Version simplifiée */}
        {activeTab === 'plu' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Configuration de l'API Carto (IGN) - Module GPU</h2>
                <p className="text-gray-600">Paramètres d'accès au Géoportail de l'Urbanisme via l'API Carto pour la récupération automatique des réglementations.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  apiStatus.plu === 'online' ? 'bg-green-100 text-green-700' :
                  apiStatus.plu === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {apiStatus.plu === 'online' ? 
                    <><CheckCircle size={14} /> En ligne</> :
                    apiStatus.plu === 'maintenance' ? 
                    <><AlertCircle size={14} /> Maintenance</> :
                    <><X size={14} /> Hors ligne</>
                  }
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg border border-green-100 p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 text-sm mb-2">
                    L'API Carto module GPU permet l'extraction automatique des données du Géoportail de l'Urbanisme. Cette intégration simplifie la récupération des règlements d'urbanisme et zonages PLU applicables à une parcelle.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="col-span-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plu-url">
                      URL API Carto GPU
                    </label>
                    <input
                      id="plu-url"
                      type="text"
                      value="https://apicarto.ign.fr/api/gpu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">URL officielle de l'API Carto module GPU (Géoportail de l'Urbanisme) - ne pas modifier</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Informations à extraire automatiquement</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-green-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Document d'urbanisme</span>
                            <p className="text-xs text-gray-500">Type, date d'approbation, état</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-green-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Zonages</span>
                            <p className="text-xs text-gray-500">Zones du PLU applicables</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-green-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Prescriptions</span>
                            <p className="text-xs text-gray-500">Règles particulières applicables</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              defaultChecked={true}
                            />
                            <div className="block w-10 h-6 rounded-full bg-green-600"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3">
                            <span className="text-sm text-gray-700 font-medium">Servitudes</span>
                            <p className="text-xs text-gray-500">Servitudes d'utilité publique</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={pluForm.autoUpdate}
                          onChange={(e) => setPluForm({...pluForm, autoUpdate: e.target.checked})}
                        />
                        <div className={`block w-14 h-8 rounded-full ${pluForm.autoUpdate ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${pluForm.autoUpdate ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        Extraction automatique des données lors de l'ajout d'une nouvelle parcelle
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => testConnection('plu')}
                        disabled={testLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                          testLoading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 
                          'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {testLoading ? <RefreshCw size={16} className="animate-spin" /> : 
                         testSuccess === true ? <CheckCircle size={16} /> :
                         testSuccess === false ? <AlertCircle size={16} /> :
                         <Network size={16} />}
                        <span>
                          {testLoading ? 'Test en cours...' : 
                           testSuccess === true ? 'Connexion réussie' :
                           testSuccess === false ? 'Échec de connexion' :
                           'Tester la connexion à l\'API'}
                        </span>
                      </button>
                      
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                        <Download size={16} />
                        <span>Vérifier les mises à jour</span>
                      </button>
                    </div>
                    
                    <button className="px-4 py-2 bg-green-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-green-700">
                      <Save size={16} />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BarChart2 size={16} className="text-green-500" />
                    Statistiques d'utilisation
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Requêtes ce mois-ci</span>
                        <span className="text-xs font-medium text-gray-700">{getUsageStats('plu').requestsThisMonth}/{getUsageStats('plu').quota}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${(getUsageStats('plu').requestsThisMonth / getUsageStats('plu').quota) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Temps de réponse moyen</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('plu').averageResponseTime}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Taux de succès</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('plu').successRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Dernière mise à jour PLU</span>
                      <span className="text-sm font-medium text-gray-800">02/04/2025</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg border border-green-100 p-4 mt-4">
                  <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Informations sur l'API Carto GPU
                  </h3>
                  
                  <p className="text-xs text-green-600 mb-2">
                    L'API Carto module GPU permet d'accéder aux données du Géoportail de l'Urbanisme directement depuis votre application.
                  </p>
                  
                  <ul className="text-xs text-green-600 list-disc pl-4 space-y-1">
                    <li>Documents d'urbanisme numérisés</li>
                    <li>Zonages et règlements PLU</li>
                    <li>Prescriptions et servitudes</li>
                    <li>Format GeoJSON WGS84</li>
                    <li>Pas de clé API requise pour le module GPU</li>
                  </ul>
                  
                  <div className="mt-2">
                    <a href="https://apicarto.ign.fr/api/doc/gpu" target="_blank" className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Documentation officielle de l'API</span>
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Database size={16} className="text-green-500" />
                    Exemple de données récupérées
                  </h3>
                  
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                    {`{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "typezone": "U",
      "libelle": "UB",
      "libelong": "Zone urbaine mixte",
      "datappro": "2023-05-10"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [...]
    }
  }]
}`}
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Remarque</h4>
                      <p className="text-xs text-amber-600">
                        Les données PLU sont mises à jour par les collectivités. Certaines communes peuvent avoir des données plus récentes que d'autres.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CERFA - Avec liste complète */}
        {activeTab === 'cerfa' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Configuration générateur CERFA</h2>
                <p className="text-gray-600">Paramètres du générateur de formulaires CERFA et documents administratifs.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  apiStatus.cerfa === 'online' ? 'bg-green-100 text-green-700' :
                  apiStatus.cerfa === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {apiStatus.cerfa === 'online' ? 
                    <><CheckCircle size={14} /> En ligne</> :
                    apiStatus.cerfa === 'maintenance' ? 
                    <><AlertCircle size={14} /> Maintenance</> :
                    <><X size={14} /> Hors ligne</>
                  }
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm mb-2">
                    Le générateur CERFA est un service local qui ne nécessite pas de clé API. Il utilise les données du cadastre et du PLU pour générer les formulaires.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Les formulaires générés sont pré-remplis avec les informations du client et du projet.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="col-span-2">
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Formulaires disponibles</h3>
                    
                    <div className="space-y-3">
                      {/* Liste complète mise à jour avec tous les CERFA demandés */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13404 - Déclaration préalable</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13405 - Demande de permis de démolir</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13406 - Demande de permis de construire (maison individuelle)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13407 - Déclaration d'ouverture de chantier</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13408 - Déclaration attestant l'achèvement et la conformité</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13409 - Demande de permis de construire ou d'aménager</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13410 - Demande de certificat d'urbanisme</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Mise à jour</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13411 - Demande de modification d'un permis en cours</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">CERFA n°13412 - Demande de transfert de permis de construire</span>
                        </div>
                        <div className="flex items-center">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Download size={14} />
                            <span className="text-xs">Installer</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">CERFA n°13824 - Autorisation de travaux ERP</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Installé</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800">
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format de sortie par défaut
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="pdf">PDF</option>
                        <option value="docx">DOCX</option>
                        <option value="both">Les deux</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Répertoire des modèles
                      </label>
                      <input
                        type="text"
                        defaultValue="/templates/cerfa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Version PDFtk
                      </label>
                      <input
                        type="text"
                        defaultValue="3.2.2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compression images
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="none">Aucune</option>
                        <option value="low">Faible</option>
                        <option value="medium" selected>Moyenne</option>
                        <option value="high">Élevée</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <div className="block w-14 h-8 rounded-full bg-blue-600"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        Inclure la page récapitulative
                      </div>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <div className="block w-14 h-8 rounded-full bg-blue-600"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        Générer automatiquement la notice descriptive
                      </div>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <div className="block w-14 h-8 rounded-full bg-blue-600"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        Inclure les champs pour signature électronique
                      </div>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <div className="block w-14 h-8 rounded-full bg-blue-600"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        Incorporer les informations cadastrales automatiquement
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => testConnection('cerfa')}
                        disabled={testLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                          testLoading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 
                          'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {testLoading ? <RefreshCw size={16} className="animate-spin" /> : 
                         testSuccess === true ? <CheckCircle size={16} /> :
                         testSuccess === false ? <AlertCircle size={16} /> :
                         <Play size={16} />}
                        <span>
                          {testLoading ? 'Test en cours...' : 
                           testSuccess === true ? 'Test réussi' :
                           testSuccess === false ? 'Test échoué' :
                           'Tester le générateur'}
                        </span>
                      </button>
                      
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                        <Upload size={16} />
                        <span>Mettre à jour les modèles</span>
                      </button>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
                      <Save size={16} />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BarChart2 size={16} className="text-purple-500" />
                    Statistiques d'utilisation
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Formulaires générés ce mois-ci</span>
                        <span className="text-xs font-medium text-gray-700">{getUsageStats('cerfa').requestsThisMonth}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ width: `${(getUsageStats('cerfa').requestsThisMonth / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Temps moyen de génération</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('cerfa').averageResponseTime}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Taux de succès</span>
                      <span className="text-sm font-medium text-gray-800">{getUsageStats('cerfa').successRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Formulaires disponibles</span>
                      <span className="text-sm font-medium text-gray-800">9 / 10</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg border border-purple-100 p-4 mt-4">
                  <h3 className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Informations sur le générateur
                  </h3>
                  
                  <p className="text-xs text-purple-600 mb-2">
                    Le générateur CERFA permet de créer des formulaires administratifs pré-remplis à partir des données client.
                  </p>
                  
                  <ul className="text-xs text-purple-600 list-disc pl-4 space-y-1">
                    <li>Remplissage automatique des champs</li>
                    <li>Génération de la notice descriptive</li>
                    <li>Export PDF ou DOCX</li>
                    <li>Mise en page optimisée pour l'impression</li>
                  </ul>
                  
                  <div className="mt-2">
                    <a href="#" className="text-xs text-purple-700 hover:text-purple-800 font-medium flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Documentation technique</span>
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Mise à jour disponible</h4>
                      <p className="text-xs text-amber-600 mb-2">
                        Une nouvelle version des modèles CERFA est disponible (2025-05).
                      </p>
                      <button className="text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700">
                        Mettre à jour maintenant
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nouvelle section d'aide */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HelpCircle size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Besoin d'aide?</h4>
                      <p className="text-xs text-blue-600 mb-2">
                        Pour plus d'informations sur la configuration du générateur CERFA, consultez notre documentation ou contactez le support.
                      </p>
                      <div className="flex gap-2">
                        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Documentation
                        </button>
                        <button className="text-xs bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                          Contacter le support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Logs */}
        {activeTab === 'logs' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Logs et diagnostics</h2>
                <p className="text-gray-600">Consultez les journaux d'activité et diagnostiquez les problèmes.</p>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                  <Download size={16} />
                  <span>Exporter les logs</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
                  <RefreshCw size={16} />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Niveau de log</h3>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="error">Erreur</option>
                  <option value="warn">Avertissement</option>
                  <option value="info" selected>Information</option>
                  <option value="debug">Débogage</option>
                  <option value="trace">Trace</option>
                </select>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Service</h3>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="all">Tous les services</option>
                  <option value="cadastre">API Cadastre</option>
                  <option value="plu">API PLU</option>
                  <option value="cerfa">Générateur CERFA</option>
                </select>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Période</h3>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="1h">Dernière heure</option>
                  <option value="6h">6 dernières heures</option>
                  <option value="24h" selected>24 dernières heures</option>
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                </select>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Format</h3>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="pretty" selected>Formaté</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="text">Texte brut</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-300">Journal des événements</h3>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600">
                    Effacer
                  </button>
                  <button className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600">
                    Copier
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300 h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap">
{`[16/05/2025 10:24:32] [INFO] [CadastreService] - Démarrage du service Cadastre
[16/05/2025 10:24:33] [INFO] [PLUService] - Démarrage du service PLU
[16/05/2025 10:24:33] [INFO] [CerfaGenerator] - Démarrage du générateur CERFA
[16/05/2025 10:24:34] [INFO] [ConfigManager] - Configuration chargée avec succès
[16/05/2025 10:24:35] [WARN] [PLUService] - Certaines données PLU datent de plus de 30 jours
[16/05/2025 10:25:12] [INFO] [CadastreService] - Requête API: GET /parcelles/AB-123
[16/05/2025 10:25:13] [INFO] [CadastreService] - Réponse reçue (200 OK)
[16/05/2025 10:25:14] [INFO] [CadastreService] - Plan cadastral généré avec succès
[16/05/2025 10:25:15] [INFO] [StorageService] - Fichier cadastre_AB-123_500.pdf sauvegardé
[16/05/2025 10:26:02] [INFO] [PLUService] - Requête API: GET /reglements/zones/UB
[16/05/2025 10:26:04] [INFO] [PLUService] - Réponse reçue (200 OK)
[16/05/2025 10:26:05] [INFO] [StorageService] - Fichier reglement_UB.pdf sauvegardé
[16/05/2025 10:27:12] [INFO] [CerfaGenerator] - Génération du formulaire 13404
[16/05/2025 10:27:13] [INFO] [CerfaGenerator] - Formulaire généré avec succès
[16/05/2025 10:27:14] [INFO] [StorageService] - Fichier cerfa_13404_prerempl.pdf sauvegardé
[16/05/2025 10:30:45] [ERROR] [FaisabiliteService] - Impossible de se connecter au service d'analyse
[16/05/2025 10:30:46] [ERROR] [FaisabiliteService] - Connexion échouée après 3 tentatives
[16/05/2025 10:30:47] [WARN] [ServiceManager] - Service de faisabilité marqué hors ligne`}
                </pre>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">État du système</h3>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Version du système</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">2.3.1</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Système d'exploitation</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Ubuntu 24.04 LTS</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">CPU</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <span>45%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Mémoire</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <span>1.8 GB / 4 GB</span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Disque</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <span>56.2 GB / 100 GB</span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '56%' }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Temps d'activité</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">12 jours, 6 heures</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Actions de maintenance</h3>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <RefreshCw size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Vérifier les mises à jour</span>
                    </div>
                    <span className="text-xs text-gray-500">Dernière: 12/05/2025</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Database size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Nettoyer le cache</span>
                    </div>
                    <span className="text-xs text-gray-500">456 MB utilisés</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Sauvegarder la configuration</span>
                    </div>
                    <span className="text-xs text-gray-500">Dernière: 15/05/2025</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Upload size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Restaurer la configuration</span>
                    </div>
                    <span className="text-xs text-gray-500">3 sauvegardes disponibles</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Sliders size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Optimiser la base de données</span>
                    </div>
                    <span className="text-xs text-gray-500">Dernière: 01/05/2025</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}