import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, 
  Upload, Camera, FileText, Plus, 
  Info, Check, CheckCircle, 
  Eye, ArrowRight, Save, X, 
  Shield, FileCheck, AlertTriangle,
  ChevronDown, ChevronRight, 
  Image, File, PenTool
} from 'lucide-react';

const FicheClientOptimisee = () => {
  const [adresseMemeProjet, setAdresseMemeProjet] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [consentRGPD, setConsentRGPD] = useState(false);
  const [autorisationAdministrative, setAutorisationAdministrative] = useState(false);
  
  // États pour les sections expandables
  const [caracteristiquesExpanded, setCaracteristiquesExpanded] = useState(true);
  const [natureTravauxExpanded, setNatureTravauxExpanded] = useState(true);
  
  // États pour les checkboxes groupées
  const [caracteristiques, setCaracteristiques] = useState({
    changementDestination: false,
    erp: false,
    demolition: false,
    travauxRealises: false
  });
  
  const [natureTravaux, setNatureTravaux] = useState({
    constructionNeuve: false,
    extension: false,
    surelevation: false,
    modificationFacade: false,
    changementMenuiseries: false,
    amenagementExterieur: false,
    ite: false,
    piscine: false,
    panneauxSolaires: false,
    amenagementInterieur: false,
    refectionToiture: false,
    cloture: false
  });
  
  // Données client pré-remplies (à récupérer depuis la base de données)
  const clientData = {
    id: 'CL-2025-042',
    nom: 'Dupont Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '123 Rue Principale, 75001 Paris',
    type: 'Particulier',
    creation: '15/04/2025',
    dernierContact: '14/04/2025'
  };
  
  // Liste des documents requis actualisée
  const documentsRequis = [
    { id: 1, nom: 'Photos de près du projet', obligatoire: true, present: false, icon: 'camera' },
    { id: 2, nom: 'Photos de loin du projet', obligatoire: true, present: false, icon: 'camera' },
    { id: 3, nom: 'Croquis ou plan du projet', obligatoire: false, present: false, icon: 'drawing' },
    { id: 4, nom: 'Documents administratifs disponibles', obligatoire: false, present: false, icon: 'file' }
  ];
  
  // Traitement du formulaire
  const handleSaveForm = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  // Gestion des changements de checkboxes
  const handleCaracteristiqueChange = (key) => {
    setCaracteristiques({...caracteristiques, [key]: !caracteristiques[key]});
  };
  
  const handleNatureTravauxChange = (key) => {
    setNatureTravaux({...natureTravaux, [key]: !natureTravaux[key]});
  };
  
  return (
    <div className="bg-gray-50 p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Clients</span>
              <span>&gt;</span>
              <span className="text-blue-500">{clientData.nom}</span>
              <span>&gt;</span>
              <span className="text-blue-600 font-medium">Fiche projet</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              Fiche projet {clientData.nom}
              <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                {clientData.id}
              </span>
            </h1>
          </div>
        </div>
        
        {/* Menu de navigation rapide */}
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="#informations" className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100">
            Informations projet
          </a>
          <a href="#localisation" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            Localisation
          </a>
          <a href="#nature" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            Nature des travaux
          </a>
          <a href="#documents" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            Documents
          </a>
          <a href="#rgpd" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            RGPD et Autorisations
          </a>
        </div>
      </div>
      
      {/* Bannière d'information */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5 flex-shrink-0">
          <Info size={18} />
        </div>
        <div>
          <p className="text-blue-800 text-sm font-medium mb-1">
            Complétez cette fiche avec les informations du projet et les documents nécessaires
          </p>
          <p className="text-blue-700 text-sm">
            Les champs marqués d'un astérisque (*) sont obligatoires. Le statut du dossier sera mis à jour automatiquement lorsque tous les champs obligatoires seront remplis.
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client (pour référence) */}
            <div id="informations" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Informations client
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-700">{clientData.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700">{clientData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{clientData.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-700">{clientData.type}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-700">{clientData.adresse}</span>
                </div>
              </div>
            </div>
            
            {/* Localisation du projet */}
            <div id="localisation" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Localisation du projet*
              </h2>
              
              <div className="mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={adresseMemeProjet}
                    onChange={() => setAdresseMemeProjet(!adresseMemeProjet)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">L'adresse du projet est identique à celle du client</span>
                </label>
              </div>
              
              {!adresseMemeProjet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse*
                    </label>
                    <input
                      type="text"
                      placeholder="Numéro et nom de rue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complément d'adresse
                    </label>
                    <input
                      type="text"
                      placeholder="Appartement, étage, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal*
                    </label>
                    <input
                      type="text"
                      placeholder="Code postal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville*
                    </label>
                    <input
                      type="text"
                      placeholder="Ville"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Références cadastrales (si connues)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Section AB, parcelle 123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ces informations seront automatiquement récupérées ultérieurement si non renseignées
                  </p>
                </div>
              </div>
            </div>
            
            {/* Nature du projet - AMÉLIORÉ */}
            <div id="nature" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building size={20} className="text-blue-600" />
                Nature du projet*
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surface existante (m²)*
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surface projetée après travaux (m²)*
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Caractéristiques du projet - Menu déroulant */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setCaracteristiquesExpanded(!caracteristiquesExpanded)}
                >
                  <span className="font-medium text-gray-800">Caractéristiques du projet*</span>
                  {caracteristiquesExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {caracteristiquesExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          id="changement-destination" 
                          className="mr-3" 
                          checked={caracteristiques.changementDestination}
                          onChange={() => handleCaracteristiqueChange('changementDestination')}
                        />
                        <label htmlFor="changement-destination" className="text-sm text-gray-700 cursor-pointer flex-1">
                          Changement de destination
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          id="erp" 
                          className="mr-3" 
                          checked={caracteristiques.erp}
                          onChange={() => handleCaracteristiqueChange('erp')}
                        />
                        <label htmlFor="erp" className="text-sm text-gray-700 cursor-pointer flex-1">
                          Établissement recevant du public (ERP)
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          id="demolition" 
                          className="mr-3" 
                          checked={caracteristiques.demolition}
                          onChange={() => handleCaracteristiqueChange('demolition')}
                        />
                        <label htmlFor="demolition" className="text-sm text-gray-700 cursor-pointer flex-1">
                          Démolition
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          id="travaux-realises" 
                          className="mr-3" 
                          checked={caracteristiques.travauxRealises}
                          onChange={() => handleCaracteristiqueChange('travauxRealises')}
                        />
                        <label htmlFor="travaux-realises" className="text-sm text-gray-700 cursor-pointer flex-1">
                          Travaux déjà réalisés
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nature des travaux - Menu déroulant amélioré */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setNatureTravauxExpanded(!natureTravauxExpanded)}
                >
                  <span className="font-medium text-gray-800">Nature des travaux*</span>
                  {natureTravauxExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {natureTravauxExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {/* Première ligne */}
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.constructionNeuve ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="construction-neuve" 
                          className="hidden" 
                          checked={natureTravaux.constructionNeuve}
                          onChange={() => handleNatureTravauxChange('constructionNeuve')}
                        />
                        <label htmlFor="construction-neuve" className="cursor-pointer flex flex-col items-center">
                          <Building size={24} className={natureTravaux.constructionNeuve ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.constructionNeuve ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Construction neuve
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.extension ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="extension" 
                          className="hidden" 
                          checked={natureTravaux.extension}
                          onChange={() => handleNatureTravauxChange('extension')}
                        />
                        <label htmlFor="extension" className="cursor-pointer flex flex-col items-center">
                          <Plus size={24} className={natureTravaux.extension ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.extension ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Extension
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.surelevation ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="surelevation" 
                          className="hidden" 
                          checked={natureTravaux.surelevation}
                          onChange={() => handleNatureTravauxChange('surelevation')}
                        />
                        <label htmlFor="surelevation" className="cursor-pointer flex flex-col items-center">
                          <ArrowRight size={24} className={`transform rotate-90 ${natureTravaux.surelevation ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.surelevation ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Surélévation
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.modificationFacade ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="modification-facade" 
                          className="hidden" 
                          checked={natureTravaux.modificationFacade}
                          onChange={() => handleNatureTravauxChange('modificationFacade')}
                        />
                        <label htmlFor="modification-facade" className="cursor-pointer flex flex-col items-center">
                          <Building size={24} className={natureTravaux.modificationFacade ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.modificationFacade ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Modification façade
                          </span>
                        </label>
                      </div>
                      
                      {/* Deuxième ligne */}
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.changementMenuiseries ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="changement-menuiseries" 
                          className="hidden" 
                          checked={natureTravaux.changementMenuiseries}
                          onChange={() => handleNatureTravauxChange('changementMenuiseries')}
                        />
                        <label htmlFor="changement-menuiseries" className="cursor-pointer flex flex-col items-center">
                          <FileText size={24} className={natureTravaux.changementMenuiseries ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.changementMenuiseries ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Changement menuiseries
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.amenagementExterieur ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="amenagement-exterieur" 
                          className="hidden" 
                          checked={natureTravaux.amenagementExterieur}
                          onChange={() => handleNatureTravauxChange('amenagementExterieur')}
                        />
                        <label htmlFor="amenagement-exterieur" className="cursor-pointer flex flex-col items-center">
                          <MapPin size={24} className={natureTravaux.amenagementExterieur ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.amenagementExterieur ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Aménagement extérieur
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.ite ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="ite" 
                          className="hidden" 
                          checked={natureTravaux.ite}
                          onChange={() => handleNatureTravauxChange('ite')}
                        />
                        <label htmlFor="ite" className="cursor-pointer flex flex-col items-center">
                          <Building size={24} className={natureTravaux.ite ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.ite ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Isolation thermique ext.
                          </span>
                        </label>
                      </div>
                      
                      <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${natureTravaux.piscine ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          id="piscine" 
                          className="hidden" 
                          checked={natureTravaux.piscine}
                          onChange={() => handleNatureTravauxChange('piscine')}
                        />
                        <label htmlFor="piscine" className="cursor-pointer flex flex-col items-center">
                          <Info size={24} className={natureTravaux.piscine ? 'text-blue-500' : 'text-gray-400'} />
                          <span className={`text-sm mt-2 text-center ${natureTravaux.piscine ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            Piscine
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée du projet*
                </label>
                <textarea
                  placeholder="Décrivez en détail la nature des travaux à réaliser..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Fournissez tous les détails pertinents sur les travaux envisagés, les matériaux, les dimensions, etc.
                </p>
              </div>
            </div>
            
            {/* Documents section - Améliorée */}
            <div id="documents" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Documents requis
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-700">
                  <Upload size={14} />
                  <span>Ajouter des documents</span>
                </button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-200">
                  <Camera size={14} />
                  <span>Prendre des photos</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {documentsRequis.map((doc) => (
                  <div key={doc.id} className={`p-4 rounded-lg border ${doc.present ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-colors hover:bg-blue-50 hover:border-blue-200`}>
                    <div className="flex items-start gap-3">
                      {doc.icon === 'camera' && <Camera size={20} className="text-blue-500 mt-0.5" />}
                      {doc.icon === 'drawing' && <PenTool size={20} className="text-blue-500 mt-0.5" />}
                      {doc.icon === 'file' && <File size={20} className="text-blue-500 mt-0.5" />}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-800">
                            {doc.nom}
                            {doc.obligatoire && <span className="text-red-600 ml-1">*</span>}
                          </h3>
                          {doc.present ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Reçu</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">À fournir</span>
                          )}
                        </div>
                        
                        <div className="border border-dashed border-gray-300 rounded-md p-2 h-20 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                          <div className="text-center">
                            <Upload size={16} className="mx-auto text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Déposer ou Cliquer pour ajouter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Documents importants</h3>
                    <p className="text-sm text-blue-700">
                      Les photos de près et de loin du projet sont indispensables pour évaluer les travaux. Si vous disposez d'un croquis ou de plans, même sommaires, ils faciliteront grandement le traitement de votre dossier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes internes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center gap-2">
                Notes internes <span className="text-xs text-gray-500">(visibles uniquement par l'équipe)</span>
              </h3>
              
              <textarea
                placeholder="Ajoutez des notes supplémentaires à usage interne..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              ></textarea>
            </div>
            
            {/* RGPD et autorisations - Déplacé à la fin */}
            <div id="rgpd" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                RGPD et autorisations administratives
              </h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Conformité RGPD et autorisations requises
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Les informations ci-dessous sont nécessaires pour le traitement de votre dossier dans le respect du Règlement Général sur la Protection des Données (RGPD).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Consentement RGPD */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    Consentement RGPD
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    En application du Règlement Général sur la Protection des Données (RGPD), nous vous informons que les données collectées dans ce formulaire sont nécessaires au traitement de votre dossier de demande d'autorisation de travaux. Ces données sont conservées pendant la durée légale requise et sont destinées exclusivement aux services de DTAHC sarl et aux administrations concernées.
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données en contactant DTAHC sarl à l'adresse contact@construires.fr.
                  </p>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={consentRGPD}
                      onChange={() => setConsentRGPD(!consentRGPD)}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      J'ai lu et j'accepte les conditions de traitement de mes données personnelles*
                    </span>
                  </label>
                </div>
                
                {/* Autorisation administrative */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <FileCheck size={16} className="text-blue-600" />
                    Procuration administrative
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Afin de faciliter les démarches administratives liées à votre projet, nous vous proposons de gérer pour votre compte les demandes d'autorisation auprès des services compétents (mairie, services de l'urbanisme, etc.).
                  </p>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={autorisationAdministrative}
                      onChange={() => setAutorisationAdministrative(!autorisationAdministrative)}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      J'autorise DTAHC sarl à effectuer en mon nom et pour mon compte toutes les démarches nécessaires à l'obtention des autorisations de travaux*
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonne latérale (1/3) - Documents highlights */}
          <div className="space-y-6">
            {/* Aperçu caméra */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-medium text-gray-800 mb-4">Prendre des photos</h3>
              <div className="bg-gray-900 h-48 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                <Camera size={36} className="text-white" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-40 flex justify-center">
                  <button className="p-2 bg-white rounded-full">
                    <Camera size={20} className="text-gray-800" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <button className="flex-1 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-200">
                  Photo de près
                </button>
                <button className="flex-1 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-200">
                  Photo de loin
                </button>
              </div>
            </div>
            
            {/* Conseils upload */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-medium text-gray-800 mb-4">Conseils pour vos documents</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Camera size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Photos de l'existant</h4>
                    <p className="text-xs text-gray-600">
                      Prenez des photos montrant clairement l'état actuel des façades, de l'environnement et des zones concernées par les travaux.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <PenTool size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Croquis du projet</h4>
                    <p className="text-xs text-gray-600">
                      Même un simple dessin à main levée peut aider à comprendre votre projet. N'hésitez pas à annoter vos croquis.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <File size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Documents administratifs</h4>
                    <p className="text-xs text-gray-600">
                      Si vous disposez déjà de documents liés au projet (devis, plan cadastral, etc.), ajoutez-les à votre dossier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 flex justify-between items-center shadow-md z-10">
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          <X size={16} />
          <span>Annuler</span>
        </button>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Save size={16} />
            <span>Enregistrer brouillon</span>
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
            onClick={handleSaveForm}
          >
            <Check size={16} />
            <span>Valider et continuer</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Toast de succès */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg animate-slide-up">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-green-800 font-medium">Informations du projet enregistrées avec succès</span>
          <button 
            className="ml-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowSuccessToast(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FicheClientOptimisee;