import React, { useState } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, FileText, 
  User, Mail, Phone, MapPin, ArrowRight, Save, 
  X, Check, HelpCircle, Info, Plus, Calendar,
  Download, Eye, Edit, ChevronRight, ChevronDown
} from 'lucide-react';

const FicheAdministrative = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [expandedSection, setExpandedSection] = useState('type');
  const [dossierType, setDossierType] = useState('');
  const [dossierEtape, setDossierEtape] = useState('INITIAL');
  const [dossierStatut, setDossierStatut] = useState('EN ATTENTE');
  const [dossierPriorite, setDossierPriorite] = useState('normal');
  
  // Données simulées du client et du projet
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
  
  const projetData = {
    adresse: '123 Rue Principale, 75001 Paris',
    surfaceExistante: 120,
    surfaceProjetee: 155,
    changementDestination: false,
    travaux: ['Modification façade', 'Changement menuiseries'],
    description: 'Rénovation de façade avec remplacement des fenêtres existantes par des fenêtres à double vitrage.'
  };
  
  // Liste des types de dossiers
  const typesDossiers = [
    { id: 'DP', label: 'Déclaration préalable (DP)', description: 'Pour les travaux de faible importance' },
    { id: 'DP+MUR', label: 'DP + Mur', description: 'Déclaration préalable incluant un mur de clôture' },
    { id: 'DP_ITE', label: 'DP ITE', description: 'Déclaration préalable pour isolation thermique par l\'extérieur' },
    { id: 'DP_FENETRE', label: 'DP Fenêtre', description: 'Déclaration préalable pour changement de fenêtres' },
    { id: 'DP_PISCINE', label: 'DP Piscine', description: 'Déclaration préalable pour construction de piscine' },
    { id: 'DP_SOLAIR', label: 'DP Solaire', description: 'Déclaration préalable pour installation panneaux solaires' },
    { id: 'PC+RT', label: 'Permis de construire + RT2020', description: 'Permis de construire avec étude thermique' },
    { id: 'PC+RT+SIGNATURE', label: 'PC + RT + Signature', description: 'Permis de construire complet avec signature architecte' },
    { id: 'PC_MODIF', label: 'PC Modificatif', description: 'Modification d\'un permis de construire existant' },
    { id: 'ERP', label: 'Dossier ERP', description: 'Pour établissements recevant du public' }
  ];
  
  // Liste des étapes
  const etapesList = [
    { id: 'INITIAL', label: 'Initial' },
    { id: 'ATTENTE_PIECE', label: 'Attente pièce' },
    { id: 'ETUDE_APS', label: 'Étude APS' },
    { id: 'DOSSIER_COMPLET', label: 'Dossier complet' },
    { id: 'RE_2020', label: 'RE 2020' },
    { id: 'SIGNATURE_ARCHI', label: 'Signature Architecte' }
  ];
  
  // Liste des statuts
  const statutsList = [
    { id: 'EN_ATTENTE', label: 'En attente' },
    { id: 'TOP_URGENT', label: 'TOP URGENT' },
    { id: 'A_DEPOSER', label: 'À déposer en ligne' },
    { id: 'DEPOSE', label: 'Dépôt en ligne' },
    { id: 'LIVRE_CLIENT', label: 'Livré client' },
    { id: 'INCOMPLETUDE', label: 'Incompletude mairie' }
  ];
  
  // Gérer l'expansion des sections
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Recommandation algorithmique du type de dossier basée sur les informations du projet
  const getRecommendedDossierType = () => {
    // Logique simplifiée basée sur les informations du projet
    const { surfaceExistante, surfaceProjetee, travaux } = projetData;
    const surfaceCreee = surfaceProjetee - surfaceExistante;
    
    if (travaux.includes('Changement menuiseries') && !travaux.includes('Modification façade')) {
      return 'DP_FENETRE';
    } else if (surfaceCreee > 40) {
      return 'PC+RT';
    } else if (travaux.includes('Isolation thermique extérieure')) {
      return 'DP_ITE';
    } else if (travaux.includes('Modification façade')) {
      return 'DP';
    } else {
      return 'DP';
    }
  };
  
  // Traitement de l'enregistrement
  const handleSave = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Clients</span>
            <ChevronRight size={14} />
            <span className="text-blue-500">{clientData.nom}</span>
            <ChevronRight size={14} />
            <span className="text-blue-600 font-medium">Fiche administrative</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            Configuration dossier {clientData.nom}
            <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              {clientData.id}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <X size={16} />
            <span>Annuler</span>
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
            onClick={handleSave}
          >
            <Save size={16} />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
      
      {/* Panneau d'information */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <Info size={18} />
        </div>
        <div>
          <p className="text-blue-800 text-sm font-medium mb-1">
            Fiche administrative et validation du type de dossier
          </p>
          <p className="text-blue-700 text-sm">
            Cette étape vous permet de finaliser les informations administratives du dossier, 
            de valider ou modifier le type de dossier suggéré automatiquement selon l'analyse des informations client.
          </p>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section de gauche: Informations client et projet */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h2 className="font-medium text-gray-700">Informations client</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
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
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <span className="text-gray-700">{clientData.adresse}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
              <h2 className="font-medium text-gray-700">Résumé du projet</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                Voir détails
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Adresse du projet</p>
                  <p className="text-gray-700">{projetData.adresse}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Surface existante</p>
                    <p className="text-gray-700">{projetData.surfaceExistante} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Surface projetée</p>
                    <p className="text-gray-700">{projetData.surfaceProjetee} m²</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nature des travaux</p>
                  <ul className="list-disc pl-5 text-gray-700 text-sm">
                    {projetData.travaux.map((travail, index) => (
                      <li key={index}>{travail}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">{projetData.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h2 className="font-medium text-gray-700">Téléchargements rapides</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <span>Informations client</span>
                  </div>
                  <Download size={16} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <span>Fiche projet</span>
                  </div>
                  <Download size={16} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <span>Photos du site</span>
                  </div>
                  <Eye size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section de droite: Configuration administrative */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Section type de dossier */}
            <div className="border-b border-gray-200">
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('type')}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                    1
                  </span>
                  Type de dossier
                </h2>
                {expandedSection === 'type' ? (
                  <ChevronDown size={20} className="text-gray-500" />
                ) : (
                  <ChevronRight size={20} className="text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'type' && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                      <div className="text-green-500 mt-0.5">
                        <CheckCircle size={18} />
                      </div>
                      <div>
                        <p className="text-green-800 text-sm font-medium mb-1">
                          Recommandation automatique
                        </p>
                        <p className="text-green-700 text-sm">
                          Selon l'analyse des informations fournies, nous recommandons un dossier de type 
                          <span className="font-medium"> {typesDossiers.find(t => t.id === getRecommendedDossierType())?.label}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionnez le type de dossier à créer*
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      value={dossierType}
                      onChange={(e) => setDossierType(e.target.value)}
                    >
                      <option value="">-- Sélectionnez un type --</option>
                      {typesDossiers.map((type) => (
                        <option 
                          key={type.id} 
                          value={type.id}
                          className={getRecommendedDossierType() === type.id ? 'font-medium text-green-700' : ''}
                        >
                          {type.label} {getRecommendedDossierType() === type.id ? '(Recommandé)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {dossierType && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          Détails du type sélectionné
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {typesDossiers.find(t => t.id === dossierType)?.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Check size={14} className="text-green-500" />
                            <span className="text-gray-700">Dossier standard</span>
                          </div>
                          {dossierType.includes('PC') && (
                            <div className="flex items-center gap-2 text-sm">
                              <Check size={14} className="text-green-500" />
                              <span className="text-gray-700">Étude thermique RE2020 incluse</span>
                            </div>
                          )}
                          {dossierType.includes('SIGNATURE') && (
                            <div className="flex items-center gap-2 text-sm">
                              <Check size={14} className="text-green-500" />
                              <span className="text-gray-700">Signature architecte incluse</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Clock size={16} className="text-amber-600" />
                          Délais prévisionnels
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Délai de réalisation du dossier</p>
                            <p className="text-sm font-medium text-gray-700">
                              {dossierType.includes('PC') ? '15-20 jours ouvrés' : '10-15 jours ouvrés'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Délai d'instruction mairie</p>
                            <p className="text-sm font-medium text-gray-700">
                              {dossierType.includes('PC') ? '2-3 mois' : '1 mois'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
                      onClick={() => toggleSection('etape')}
                    >
                      <span>Suivant</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section étape et statut */}
            <div className="border-b border-gray-200">
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('etape')}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                    2
                  </span>
                  Étape et statut du dossier
                </h2>
                {expandedSection === 'etape' ? (
                  <ChevronDown size={20} className="text-gray-500" />
                ) : (
                  <ChevronRight size={20} className="text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'etape' && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Étape du workflow*
                      </label>
                      <div className="space-y-2">
                        {etapesList.map((etape) => (
                          <label 
                            key={etape.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                              dossierEtape === etape.id 
                                ? 'bg-blue-50 border-blue-300' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="etape"
                              value={etape.id}
                              checked={dossierEtape === etape.id}
                              onChange={() => setDossierEtape(etape.id)}
                              className="mr-2"
                            />
                            <span className="text-gray-700">{etape.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut du dossier*
                      </label>
                      <div className="space-y-2">
                        {statutsList.map((statut) => (
                          <label 
                            key={statut.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                              dossierStatut === statut.id 
                                ? 'bg-blue-50 border-blue-300' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="statut"
                              value={statut.id}
                              checked={dossierStatut === statut.id}
                              onChange={() => setDossierStatut(statut.id)}
                              className="mr-2"
                            />
                            <span className={`
                              ${statut.id === 'TOP_URGENT' ? 'text-red-600 font-medium' : ''}
                              ${statut.id === 'EN_ATTENTE' ? 'text-amber-600' : ''}
                              ${statut.id === 'LIVRE_CLIENT' ? 'text-green-600' : ''}
                              ${!['TOP_URGENT', 'EN_ATTENTE', 'LIVRE_CLIENT'].includes(statut.id) ? 'text-gray-700' : ''}
                            `}>
                              {statut.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité du dossier
                    </label>
                    <div className="flex items-center gap-4">
                      <label 
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          dossierPriorite === 'high' 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priorite"
                          value="high"
                          checked={dossierPriorite === 'high'}
                          onChange={() => setDossierPriorite('high')}
                          className="mr-2"
                        />
                        <span className="text-red-600 font-medium">Haute</span>
                      </label>
                      
                      <label 
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          dossierPriorite === 'normal' 
                            ? 'bg-amber-50 border-amber-300' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priorite"
                          value="normal"
                          checked={dossierPriorite === 'normal'}
                          onChange={() => setDossierPriorite('normal')}
                          className="mr-2"
                        />
                        <span className="text-amber-600">Normale</span>
                      </label>
                      
                      <label 
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          dossierPriorite === 'low' 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priorite"
                          value="low"
                          checked={dossierPriorite === 'low'}
                          onChange={() => setDossierPriorite('low')}
                          className="mr-2"
                        />
                        <span className="text-green-600">Basse</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
                      onClick={() => toggleSection('assignation')}
                    >
                      <span>Suivant</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section assignation */}
            <div className="border-b border-gray-200">
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('assignation')}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                    3
                  </span>
                  Assignation et planification
                </h2>
                {expandedSection === 'assignation' ? (
                  <ChevronDown size={20} className="text-gray-500" />
                ) : (
                  <ChevronRight size={20} className="text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'assignation' && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsable du dossier
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <option value="">Sélectionnez un responsable</option>
                        <option value="user1">Sophie Martin</option>
                        <option value="user2">Thomas Dubois</option>
                        <option value="user3">Julie Petit</option>
                        <option value="user4">Laurent Bernard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date cible de livraison
                      </label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                        />
                        <div className="absolute right-0 top-0 px-3 py-2">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes de traitement interne
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      placeholder="Ajoutez des instructions ou remarques particulières pour l'équipe..."
                      rows={4}
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                      <div className="text-amber-500 mt-0.5">
                        <AlertCircle size={18} />
                      </div>
                      <div>
                        <p className="text-amber-800 text-sm font-medium mb-1">
                          Documents à collecter prioritairement
                        </p>
                        <p className="text-amber-700 text-sm">
                          Pour ce type de dossier, les documents suivants devront être collectés en priorité :
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-amber-700 text-sm">
                          <li>Plans de façade existante</li>
                          <li>Plans de façade projetée</li>
                          <li>Plan de situation</li>
                          {dossierType.includes('PC') && (
                            <>
                              <li>Photos d'insertion dans l'environnement</li>
                              <li>Permis de construire initial (si modificatif)</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
                      onClick={() => toggleSection('validation')}
                    >
                      <span>Suivant</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section validation */}
            <div>
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('validation')}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                    4
                  </span>
                  Validation et prochaines étapes
                </h2>
                {expandedSection === 'validation' ? (
                  <ChevronDown size={20} className="text-gray-500" />
                ) : (
                  <ChevronRight size={20} className="text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'validation' && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="text-base font-medium text-gray-800 mb-3">Résumé de la configuration</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Type de dossier</span>
                          <span className="text-sm font-medium text-gray-800">
                            {dossierType ? typesDossiers.find(t => t.id === dossierType)?.label : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Étape</span>
                          <span className="text-sm font-medium text-gray-800">
                            {etapesList.find(e => e.id === dossierEtape)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Statut</span>
                          <span className="text-sm font-medium text-gray-800">
                            {statutsList.find(s => s.id === dossierStatut)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Priorité</span>
                          <span className={`text-sm font-medium ${
                            dossierPriorite === 'high' ? 'text-red-600' :
                            dossierPriorite === 'normal' ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {dossierPriorite === 'high' ? 'Haute' : 
                             dossierPriorite === 'normal' ? 'Normale' : 'Basse'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="text-base font-medium text-gray-800 mb-3">Prochaines étapes</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Récupération cadastrale</p>
                            <p className="text-xs text-gray-500">Plan cadastral et informations parcellaires</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            2
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Analyse réglementaire</p>
                            <p className="text-xs text-gray-500">PLU et contraintes d'urbanisme</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            3
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Étude de faisabilité</p>
                            <p className="text-xs text-gray-500">Analyse de la conformité du projet</p>
                          </div>
                        </div>
                        {dossierType && dossierType.includes('PC') && (
                          <div className="flex items-start gap-2">
                            <div className="flex items-center justify-center mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              4
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Étude thermique RE2020</p>
                              <p className="text-xs text-gray-500">Calcul de performance énergétique</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Info size={16} className="text-blue-600" />
                        Options complémentaires
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-700">Envoyer un email de confirmation au client</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-700">Générer automatiquement les documents CERFA</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-700">Créer des tâches assignées pour l'équipe</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setExpandedSection('type')}
                    >
                      <ArrowRight size={16} className="rotate-180" />
                      <span>Revenir au début</span>
                    </button>
                    
                    <button 
                      className="px-4 py-2 bg-green-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-green-700"
                      onClick={handleSave}
                    >
                      <Check size={16} />
                      <span>Finaliser et valider</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast de succès */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg animate-slide-up">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-green-800 font-medium">Fiche administrative enregistrée avec succès</span>
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

export default FicheAdministrative;