import React, { useState } from 'react';
import {
  FileText, MapPin, Home, BarChart2, Search, Filter,
  Download, RefreshCw, Cloud, CheckCircle, XCircle,
  AlertCircle, Info, ArrowRight, Calendar, Clock, Play
} from 'lucide-react';

export default function RecuperationDocuments() {
  const [activeTab, setActiveTab] = useState('cadastre');
  const [adresse, setAdresse] = useState('123 Rue Principale, 75001 Paris');
  const [reference, setReference] = useState('DP-2025-042');
  const [parcelle, setParcelle] = useState('AB-123');
  const [commune, setCommune] = useState('Paris');
  
  // États des processus de récupération
  const [cadastreStatus, setCadastreStatus] = useState('ready'); // ready, loading, success, error
  const [pluStatus, setPluStatus] = useState('waiting'); // waiting, ready, loading, success, error
  const [cerfaStatus, setCerfaStatus] = useState('waiting'); // waiting, ready, loading, success, error
  
  const [cadastreProgress, setCadastreProgress] = useState(0);
  
  const handleCadastreGeneration = () => {
    setCadastreStatus('loading');
    setCadastreProgress(0);
    
    // Simuler le processus de progression
    const interval = setInterval(() => {
      setCadastreProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCadastreStatus('success');
            setPluStatus('ready');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const handlePluGeneration = () => {
    setPluStatus('loading');
    
    // Simuler le processus
    setTimeout(() => {
      setPluStatus('success');
      setCerfaStatus('ready');
    }, 3000);
  };
  
  const handleCerfaGeneration = () => {
    setCerfaStatus('loading');
    
    // Simuler le processus
    setTimeout(() => {
      setCerfaStatus('success');
    }, 2500);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'error':
        return <XCircle size={18} className="text-red-500" />;
      case 'loading':
        return <RefreshCw size={18} className="text-blue-500 animate-spin" />;
      case 'ready':
        return <Play size={18} className="text-blue-500" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Clients</span>
            <ArrowRight size={14} />
            <span>Dupont Jean</span>
            <ArrowRight size={14} />
            <span className="text-blue-500">Documents réglementaires</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            Récupération automatisée des documents
            <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              {reference}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} />
            <span>Tout télécharger</span>
          </button>
        </div>
      </div>
      
      {/* Informations du dossier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Informations client</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <Home size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Dupont Jean</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-700">{adresse}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Création: 15/04/2025</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Informations cadastrales</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Parcelle: {parcelle}</span>
              </div>
              <div className="flex items-center">
                <Home size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Commune: {commune}</span>
              </div>
              <div className="flex items-center">
                <BarChart2 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Surface: 120 m²</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Informations dossier</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Type: DP FENETRE</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Étape: ÉTUDE APS</span>
              </div>
              <div className="flex items-center">
                <AlertCircle size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">Statut: ATTENTE PIÈCE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'cadastre' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('cadastre')}
            >
              Plan Cadastral
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'plu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('plu')}
            >
              PLU & Réglementation
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'cerfa' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('cerfa')}
            >
              Formulaires CERFA
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'synthese' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('synthese')}
            >
              Synthèse
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
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Récupération du plan cadastral</h2>
                <p className="text-gray-600">Récupération automatique des plans cadastraux et des informations parcellaires.</p>
              </div>
              
              <button
                onClick={handleCadastreGeneration}
                disabled={cadastreStatus === 'loading' || cadastreStatus === 'success'}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                  cadastreStatus === 'loading' ? 'bg-blue-100 text-blue-600 cursor-not-allowed' : 
                  cadastreStatus === 'success' ? 'bg-green-100 text-green-600 cursor-not-allowed' : 
                  'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {cadastreStatus === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : 
                 cadastreStatus === 'success' ? <CheckCircle size={16} /> : 
                 <Cloud size={16} />}
                <span>
                  {cadastreStatus === 'loading' ? 'Récupération en cours...' : 
                   cadastreStatus === 'success' ? 'Récupération terminée' : 
                   'Lancer la récupération'}
                </span>
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm mb-2">
                    Le système va récupérer automatiquement à partir de l'adresse du client:
                  </p>
                  <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
                    <li>Plan cadastral à l'échelle 1/500</li>
                    <li>Plan de situation à l'échelle 1/3000</li>
                    <li>Informations parcellaires (références, contenance, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={cadastreStatus === 'loading' || cadastreStatus === 'success'}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={cadastreStatus === 'loading' || cadastreStatus === 'success'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence parcellaire (optionnel)</label>
                  <input
                    type="text"
                    value={parcelle}
                    onChange={(e) => setParcelle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={cadastreStatus === 'loading' || cadastreStatus === 'success'}
                  />
                </div>
              </div>
            </div>
            
            {cadastreStatus === 'loading' && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression de la récupération</span>
                  <span className="text-sm text-gray-500">{cadastreProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${cadastreProgress}%` }}
                  ></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className={`animate-spin text-blue-500`} />
                    <span className="text-sm text-gray-600">Recherche de la parcelle...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className={`${cadastreProgress > 30 ? 'animate-spin text-blue-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${cadastreProgress > 30 ? 'text-gray-600' : 'text-gray-400'}`}>Téléchargement du plan cadastral...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className={`${cadastreProgress > 60 ? 'animate-spin text-blue-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${cadastreProgress > 60 ? 'text-gray-600' : 'text-gray-400'}`}>Génération du plan de situation...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className={`${cadastreProgress > 80 ? 'animate-spin text-blue-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${cadastreProgress > 80 ? 'text-gray-600' : 'text-gray-400'}`}>Extraction des métadonnées...</span>
                  </div>
                </div>
              </div>
            )}
            
            {cadastreStatus === 'success' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Documents générés</h3>
                  <button className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800">
                    <Download size={14} />
                    <span>Tout télécharger</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { name: "Plan cadastral 1/500", size: "1.2 MB", date: "16/05/2025" },
                    { name: "Plan de situation 1/3000", size: "756 KB", date: "16/05/2025" },
                    { name: "Informations parcellaires", size: "45 KB", date: "16/05/2025" }
                  ].map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="bg-blue-50 text-blue-500 p-2 rounded mr-3">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Download size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* PLU */}
        {activeTab === 'plu' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Récupération du PLU et réglementation</h2>
                <p className="text-gray-600">Récupération automatique des règlements d'urbanisme et prescriptions applicables.</p>
              </div>
              
              <button
                onClick={handlePluGeneration}
                disabled={pluStatus === 'loading' || pluStatus === 'success' || pluStatus === 'waiting'}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                  pluStatus === 'loading' ? 'bg-blue-100 text-blue-600 cursor-not-allowed' : 
                  pluStatus === 'success' ? 'bg-green-100 text-green-600 cursor-not-allowed' : 
                  pluStatus === 'waiting' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                  'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {pluStatus === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : 
                 pluStatus === 'success' ? <CheckCircle size={16} /> : 
                 pluStatus === 'waiting' ? <Clock size={16} /> :
                 <Cloud size={16} />}
                <span>
                  {pluStatus === 'loading' ? 'Récupération en cours...' : 
                   pluStatus === 'success' ? 'Récupération terminée' : 
                   pluStatus === 'waiting' ? 'En attente cadastre' :
                   'Lancer la récupération'}
                </span>
              </button>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm mb-2">
                    Pour récupérer les informations du PLU, vous devez d'abord récupérer le plan cadastral.
                  </p>
                  <ul className="text-amber-700 text-sm list-disc pl-5 space-y-1">
                    <li>Règlement d'urbanisme de la zone</li>
                    <li>Prescriptions particulières</li>
                    <li>Contraintes spécifiques (ABF, PPRI, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {pluStatus === 'success' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Documents générés</h3>
                  <button className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800">
                    <Download size={14} />
                    <span>Tout télécharger</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { name: "Règlement zone UB", size: "2.4 MB", date: "16/05/2025" },
                    { name: "Prescriptions architecturales", size: "1.1 MB", date: "16/05/2025" },
                    { name: "Cartographie des contraintes", size: "3.2 MB", date: "16/05/2025" },
                    { name: "Synthèse réglementaire", size: "520 KB", date: "16/05/2025" }
                  ].map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="bg-amber-50 text-amber-500 p-2 rounded mr-3">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Download size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pluStatus === 'loading' && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression de la récupération</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Détermination de la zone PLU...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Téléchargement du règlement...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* CERFA */}
        {activeTab === 'cerfa' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Génération des formulaires CERFA</h2>
                <p className="text-gray-600">Génération automatique des formulaires CERFA pré-remplis avec les informations client.</p>
              </div>
              
              <button
                onClick={handleCerfaGeneration}
                disabled={cerfaStatus === 'loading' || cerfaStatus === 'success' || cerfaStatus === 'waiting'}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                  cerfaStatus === 'loading' ? 'bg-blue-100 text-blue-600 cursor-not-allowed' : 
                  cerfaStatus === 'success' ? 'bg-green-100 text-green-600 cursor-not-allowed' : 
                  cerfaStatus === 'waiting' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                  'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {cerfaStatus === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : 
                 cerfaStatus === 'success' ? <CheckCircle size={16} /> : 
                 cerfaStatus === 'waiting' ? <Clock size={16} /> :
                 <Cloud size={16} />}
                <span>
                  {cerfaStatus === 'loading' ? 'Génération en cours...' : 
                   cerfaStatus === 'success' ? 'Génération terminée' : 
                   cerfaStatus === 'waiting' ? 'En attente PLU' :
                   'Lancer la génération'}
                </span>
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <Info size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 text-sm mb-2">
                    Pour générer les formulaires CERFA, vous devez d'abord récupérer le plan cadastral et le PLU.
                  </p>
                  <p className="text-green-700 text-sm mb-2">
                    Le système détecte automatiquement le type de formulaire CERFA à utiliser en fonction du projet:
                  </p>
                  <ul className="text-green-700 text-sm list-disc pl-5 space-y-1">
                    <li>CERFA 13703*09 pour les déclarations préalables</li>
                    <li>CERFA 13406*11 pour les permis de construire</li>
                    <li>CERFA 13824*05 pour les établissements recevant du public</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de formulaire CERFA</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={cerfaStatus !== 'ready'}>
                  <option value="13703">CERFA 13703*09 - Déclaration préalable</option>
                  <option value="13406">CERFA 13406*11 - Permis de construire</option>
                  <option value="13824">CERFA 13824*05 - Autorisation de travaux ERP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de projet</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={cerfaStatus !== 'ready'}>
                  <option value="fenetres">Remplacement de fenêtres</option>
                  <option value="extension">Extension</option>
                  <option value="facade">Modification de façade</option>
                  <option value="cloture">Création d'une clôture</option>
                </select>
              </div>
            </div>
            
            {cerfaStatus === 'success' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Formulaires générés</h3>
                  <button className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800">
                    <Download size={14} />
                    <span>Tout télécharger</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { name: "CERFA 13703*09 DP", size: "845 KB", date: "16/05/2025" },
                    { name: "Notice descriptive", size: "320 KB", date: "16/05/2025" },
                    { name: "Bordereau de dépôt", size: "124 KB", date: "16/05/2025" }
                  ].map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="bg-green-50 text-green-500 p-2 rounded mr-3">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-gray-100">
                          <Download size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Synthèse */}
        {activeTab === 'synthese' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Synthèse des documents générés</h2>
              <p className="text-gray-600">Récapitulatif de tous les documents générés pour ce dossier.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className={`border rounded-lg overflow-hidden ${cadastreStatus === 'success' ? 'border-blue-200' : 'border-gray-200'}`}>
                <div className={`px-4 py-3 border-b flex justify-between items-center ${cadastreStatus === 'success' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-sm font-medium ${cadastreStatus === 'success' ? 'text-blue-700' : 'text-gray-500'}`}>Plan Cadastral</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(cadastreStatus)}
                    <span className={`text-xs ${
                      cadastreStatus === 'success' ? 'text-blue-600' : 
                      cadastreStatus === 'error' ? 'text-red-600' : 
                      cadastreStatus === 'loading' ? 'text-blue-600' : 
                      cadastreStatus === 'ready' ? 'text-blue-600' : 
                      'text-gray-500'
                    }`}>
                      {cadastreStatus === 'success' ? 'Complété' : 
                       cadastreStatus === 'error' ? 'Erreur' : 
                       cadastreStatus === 'loading' ? 'En cours' : 
                       cadastreStatus === 'ready' ? 'Prêt' : 
                       'En attente'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {cadastreStatus === 'success' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Plan cadastral 1/500</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Plan de situation 1/3000</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Informations parcellaires</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <button
                        onClick={cadastreStatus === 'ready' ? handleCadastreGeneration : undefined}
                        disabled={cadastreStatus !== 'ready'}
                        className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                          cadastreStatus === 'ready' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {cadastreStatus === 'ready' ? <Play size={14} /> : <Clock size={14} />}
                        <span>
                          {cadastreStatus === 'ready' ? 'Générer' : 'En attente'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`border rounded-lg overflow-hidden ${pluStatus === 'success' ? 'border-amber-200' : 'border-gray-200'}`}>
                <div className={`px-4 py-3 border-b flex justify-between items-center ${pluStatus === 'success' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-sm font-medium ${pluStatus === 'success' ? 'text-amber-700' : 'text-gray-500'}`}>PLU & Réglementation</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(pluStatus)}
                    <span className={`text-xs ${
                      pluStatus === 'success' ? 'text-amber-600' : 
                      pluStatus === 'error' ? 'text-red-600' : 
                      pluStatus === 'loading' ? 'text-blue-600' : 
                      pluStatus === 'ready' ? 'text-blue-600' : 
                      'text-gray-500'
                    }`}>
                      {pluStatus === 'success' ? 'Complété' : 
                       pluStatus === 'error' ? 'Erreur' : 
                       pluStatus === 'loading' ? 'En cours' : 
                       pluStatus === 'ready' ? 'Prêt' : 
                       'En attente'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {pluStatus === 'success' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Règlement zone UB</span>
                        <button className="text-amber-600 hover:text-amber-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prescriptions architecturales</span>
                        <button className="text-amber-600 hover:text-amber-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cartographie des contraintes</span>
                        <button className="text-amber-600 hover:text-amber-800">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <button
                        onClick={pluStatus === 'ready' ? handlePluGeneration : undefined}
                        disabled={pluStatus !== 'ready'}
                        className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                          pluStatus === 'ready' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {pluStatus === 'ready' ? <Play size={14} /> : <Clock size={14} />}
                        <span>
                          {pluStatus === 'ready' ? 'Générer' : 'En attente'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`border rounded-lg overflow-hidden ${cerfaStatus === 'success' ? 'border-green-200' : 'border-gray-200'}`}>
                <div className={`px-4 py-3 border-b flex justify-between items-center ${cerfaStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-sm font-medium ${cerfaStatus === 'success' ? 'text-green-700' : 'text-gray-500'}`}>Formulaires CERFA</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(cerfaStatus)}
                    <span className={`text-xs ${
                      cerfaStatus === 'success' ? 'text-green-600' : 
                      cerfaStatus === 'error' ? 'text-red-600' : 
                      cerfaStatus === 'loading' ? 'text-blue-600' : 
                      cerfaStatus === 'ready' ? 'text-blue-600' : 
                      'text-gray-500'
                    }`}>
                      {cerfaStatus === 'success' ? 'Complété' : 
                       cerfaStatus === 'error' ? 'Erreur' : 
                       cerfaStatus === 'loading' ? 'En cours' : 
                       cerfaStatus === 'ready' ? 'Prêt' : 
                       'En attente'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {cerfaStatus === 'success' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CERFA 13703*09 DP</span>
                        <button className="text-green-600 hover:text-green-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Notice descriptive</span>
                        <button className="text-green-600 hover:text-green-800">
                          <Download size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bordereau de dépôt</span>
                        <button className="text-green-600 hover:text-green-800">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <button
                        onClick={cerfaStatus === 'ready' ? handleCerfaGeneration : undefined}
                        disabled={cerfaStatus !== 'ready'}
                        className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                          cerfaStatus === 'ready' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {cerfaStatus === 'ready' ? <Play size={14} /> : <Clock size={14} />}
                        <span>
                          {cerfaStatus === 'ready' ? 'Générer' : 'En attente'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">État d'avancement du dossier</h3>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Progression globale:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: 
                        (cadastreStatus === 'success' ? 33 : 0) +
                        (pluStatus === 'success' ? 33 : 0) +
                        (cerfaStatus === 'success' ? 34 : 0) + '%'
                      }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {(cadastreStatus === 'success' ? 33 : 0) +
                       (pluStatus === 'success' ? 33 : 0) +
                       (cerfaStatus === 'success' ? 34 : 0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {cadastreStatus === 'success' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-gray-400" />}
                  <span className={`text-sm ${cadastreStatus === 'success' ? 'text-green-700' : 'text-gray-600'}`}>
                    Récupération des données cadastrales
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {pluStatus === 'success' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-gray-400" />}
                  <span className={`text-sm ${pluStatus === 'success' ? 'text-green-700' : 'text-gray-600'}`}>
                    Acquisition des règlements d'urbanisme
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {cerfaStatus === 'success' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-gray-400" />}
                  <span className={`text-sm ${cerfaStatus === 'success' ? 'text-green-700' : 'text-gray-600'}`}>
                    Génération des formulaires CERFA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Analyse de faisabilité
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Préparation du dossier complet
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    cerfaStatus === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={cerfaStatus !== 'success'}
                >
                  {cerfaStatus === 'success' ? 'Passer à l\'étape suivante' : 'Terminez la génération des documents'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Eye component for the missing import
const Eye = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);