import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Download, Send, Plus, Minus, X, 
  Calculator, Check, Users, Mail, Phone, 
  Calendar, FileText, HelpCircle, Info, Search,
  Filter, Eye, AlertTriangle, PenTool
} from 'lucide-react';

const CreationDevisOptimise = () => {
  // États principaux
  const [clientType, setClientType] = useState('particulier');
  const [pricingMethod, setPricingMethod] = useState('grid');
  const [showTarificationOptions, setShowTarificationOptions] = useState(false);
  const [showClientSearchModal, setShowClientSearchModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newNoteVisible, setNewNoteVisible] = useState(false);
  const [showCommonElements, setShowCommonElements] = useState(false);
  
  // Options de tarifs - récupérées de la grille tarifaire
  const tarifOptions = [
    { id: 'dp-fenetre', label: 'DP FENETRE', price: '950.00', delai: '10 jours' },
    { id: 'dp-mur', label: 'DP+MUR', price: '1100.00', delai: '12 jours' },
    { id: 'dp-ite', label: 'DP ITE', price: '1300.00', delai: '14 jours' },
    { id: 'pc-rt', label: 'PC+RT', price: '2300.00', delai: '21 jours' },
    { id: 'pc-rt-signature', label: 'PC+RT+SIGNATURE', price: '2800.00', delai: '28 jours' },
    { id: 'erp', label: 'ERP', price: '3200.00', delai: '30 jours' }
  ];
  
  // Liste complète des professionnels comme demandé
  const proOptions = [
    { id: 'particulier', label: 'PARTICULIER' },
    { id: 'arcadia', label: 'ARCADIA' },
    { id: 'comble-df', label: 'COMBLE DF' },
    { id: 'eca', label: 'ECA' },
    { id: 'lt-artisan', label: 'LT ARTISAN' },
    { id: 'soderbat', label: 'SODERBAT' },
    { id: 'comblespace', label: 'COMBLESPACE' },
    { id: 'mdt-antony', label: 'MDT ANTONY' },
    { id: 'mdt-robert', label: 'MDT C.ROBERT' },
    { id: 'mdt-yerres', label: 'MDT YERRES' },
    { id: 'mdt-stgen', label: 'MDT ST-GEN' },
    { id: 'b3c', label: 'B3C' },
    { id: 'terrasse-jar', label: 'TERRASSE ET JAR' },
    { id: 'renokea', label: 'RENOKEA' },
    { id: 'groupe-apb', label: 'GROUPE APB' },
    { id: 'purewatt', label: 'PUREWATT' },
    { id: 's-augusto', label: 'S.AUGUSTO' },
    { id: '3d-travaux', label: '3D TRAVAUX' },
    { id: 'bati-presto', label: 'BATI PRESTO' },
    { id: 'cphf', label: 'CPHF' },
    { id: 'mdt-font', label: 'MDT FONT' }
  ];
  
  // Éléments communs pour les descriptions
  const commonElements = [
    { 
      id: 'real-pc', 
      title: 'Réalisation dossier Permis de Construire',
      text: 'Réalisation d\'un dossier de Permis de Construire'
    },
    { 
      id: 'real-dp', 
      title: 'Réalisation dossier Déclaration Préalable',
      text: 'Réalisation d\'un dossier de Déclaration Préalable de travaux'
    },
    { 
      id: 'pieces-dossier', 
      title: 'Pièces du dossier',
      text: 'Les pièces du dossier qui vous sera transmis de la manière suivante par mail Format A3/A4 :\n • Page de garde\n • Sommaire\n • DP/PCMI 1 Plan de situation\n • DP/PCMI 2 Plan de masse\n • DP/PCMI 3 Coupe sur terrain\n • DP/PCMI 4 Notice\n • DP/PCMI 5 Plan de Façades\n • DP/PCMI 6 7 8 Volet paysager\n • Bordereau Cerfa'
    },
    { 
      id: 'attestation-re2020', 
      title: 'Attestation thermique',
      text: 'Attestation thermique RE 2020'
    },
    { 
      id: 'prises-mesures', 
      title: 'Prises de mesures',
      text: 'L\'ensemble des prises de mesures, cotes recueillies afin de réaliser des plans au format papier ou numérique'
    }
  ];
  
  // Modèles de devis disponibles
  const templates = [
    { id: 'template-standard', name: 'Devis Standard', type: 'particulier' },
    { id: 'template-detaille', name: 'Devis Détaillé', type: 'particulier' },
    { id: 'template-pro', name: 'Devis Professionnel', type: 'professionnel' },
    { id: 'template-multi', name: 'Devis Multi-clients', type: 'professionnel' }
  ];

  // État du formulaire
  const [formState, setFormState] = useState({
    client: {
      id: 'NOUVEAU',
      nom: '',
      email: '',
      telephone: '',
      adresse: ''
    },
    devis: {
      numero: 'DEV-2025-048',
      date: getFormattedCurrentDate(),
      validite: '60',
      dateValidite: calculateValidityDate(getFormattedCurrentDate(), 60),
      typeDossier: 'dp-fenetre',
      proType: 'particulier',
      tauxTVA: 20,
      remise: 0,
      acompte: 30,
      delaiPaiement: 30,
      montantHT: '950.00',
      montantTVA: '190.00',
      montantTTC: '1140.00',
      montantAcompte: '342.00',
      montantSolde: '798.00'
    },
    items: [
      {
        id: 1,
        description: 'Déclaration préalable pour changement de fenêtres',
        quantite: 1,
        unite: 'forfait',
        prixUnitaire: '800.00',
        remise: 0,
        totalHT: '800.00'
      },
      {
        id: 2,
        description: 'Frais de dépôt et suivi administratif',
        quantite: 1,
        unite: 'forfait',
        prixUnitaire: '150.00',
        remise: 0,
        totalHT: '150.00'
      }
    ],
    notes: [
      {
        id: 1, 
        text: "Le délai de réalisation commence à la réception de l'acompte et de l'ensemble des documents nécessaires."
      }
    ]
  });
  
  // Clients récemment utilisés pour la recherche rapide (auto-remplissage)
  const recentClients = [
    { id: 'CL-2025-042', nom: 'Dupont Jean', email: 'jean.dupont@example.com', telephone: '06 12 34 56 78', adresse: '123 Rue Principale, 75001 Paris', type: 'particulier' },
    { id: 'CL-2025-039', nom: 'Martin Sophie', email: 'sophie.martin@example.com', telephone: '07 22 33 44 55', adresse: '45 Avenue des Fleurs, 75015 Paris', type: 'particulier' },
    { id: 'CL-2025-038', nom: 'ARCADIA MEGACOMBLES', email: 'contact@arcadia.fr', telephone: '01 23 45 67 89', adresse: '30 Av. Robert Surcouf, 78960 Voisins-le Bretonneux', type: 'professionnel' }
  ];
  
  // Fonctions utilitaires
  function getFormattedCurrentDate() {
    const date = new Date();
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  function calculateValidityDate(dateStr, days) {
    const parts = dateStr.split('/');
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    date.setDate(date.getDate() + parseInt(days));
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  // Ajouter un élément au devis
  const addItem = () => {
    const newItem = {
      id: formState.items.length + 1,
      description: '',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: '0.00',
      remise: 0,
      totalHT: '0.00'
    };
    
    setFormState({
      ...formState,
      items: [...formState.items, newItem]
    });
  };
  
  // Supprimer un élément du devis
  const removeItem = (id) => {
    setFormState({
      ...formState,
      items: formState.items.filter(item => item.id !== id)
    });
  };

  // Ajouter un élément commun au devis
  const addCommonElement = (element) => {
    const index = formState.items.findIndex(item => item.description === '');
    if (index !== -1) {
      // Si un élément vide existe, on le remplace
      const newItems = [...formState.items];
      newItems[index].description = element.text;
      setFormState({
        ...formState,
        items: newItems
      });
    } else {
      // Sinon on ajoute un nouvel élément
      const newItem = {
        id: formState.items.length + 1,
        description: element.text,
        quantite: 1,
        unite: 'forfait',
        prixUnitaire: '0.00',
        remise: 0,
        totalHT: '0.00'
      };
      
      setFormState({
        ...formState,
        items: [...formState.items, newItem]
      });
    }
    setShowCommonElements(false);
  };
  
  // Ajouter une note
  const addNote = (text) => {
    const newNote = {
      id: formState.notes.length + 1,
      text: text
    };
    
    setFormState({
      ...formState,
      notes: [...formState.notes, newNote]
    });
    setNewNoteVisible(false);
  };
  
  // Supprimer une note
  const removeNote = (id) => {
    setFormState({
      ...formState,
      notes: formState.notes.filter(note => note.id !== id)
    });
  };
  
  // Remises par type de professionnel (table de correspondance)
  const proDiscounts = {
    'particulier': 0,
    'arcadia': 15,
    'comble-df': 20,
    'mdt-antony': 17.5,
    'groupe-apb': 13,
    'eca': 16.4,
    // Ajouter d'autres remises si nécessaire
    'default': 10 // Remise par défaut pour les pros
  };
  
  // Mettre à jour le prix basé sur le type de dossier
  const updatePriceFromDossierType = (typeDossier) => {
    const selectedTarif = tarifOptions.find(t => t.id === typeDossier);
    if (selectedTarif) {
      // Calculer la remise en fonction du type de pro
      const remisePercent = clientType === 'professionnel' ? 
        (proDiscounts[formState.devis.proType] || proDiscounts.default) : 0;
      
      const prixBase = parseFloat(selectedTarif.price);
      const prixRemise = prixBase * (1 - remisePercent / 100);
      
      // Mise à jour des éléments
      const items = [
        {
          id: 1,
          description: `${selectedTarif.label} - Prestation principale`,
          quantite: 1,
          unite: 'forfait',
          prixUnitaire: (prixRemise * 0.8).toFixed(2),
          remise: 0,
          totalHT: (prixRemise * 0.8).toFixed(2)
        },
        {
          id: 2,
          description: 'Frais de dépôt et suivi administratif',
          quantite: 1,
          unite: 'forfait',
          prixUnitaire: (prixRemise * 0.2).toFixed(2),
          remise: 0,
          totalHT: (prixRemise * 0.2).toFixed(2)
        }
      ];
      
      // Mise à jour des montants
      const montantHT = prixRemise.toFixed(2);
      const tauxTVA = parseFloat(formState.devis.tauxTVA);
      const montantTVA = (prixRemise * tauxTVA / 100).toFixed(2);
      const montantTTC = (prixRemise * (1 + tauxTVA / 100)).toFixed(2);
      const acomptePercent = parseFloat(formState.devis.acompte);
      const montantAcompte = (parseFloat(montantTTC) * acomptePercent / 100).toFixed(2);
      const montantSolde = (parseFloat(montantTTC) - parseFloat(montantAcompte)).toFixed(2);
      
      setFormState({
        ...formState,
        devis: {
          ...formState.devis,
          typeDossier,
          remise: remisePercent,
          montantHT,
          montantTVA,
          montantTTC,
          montantAcompte,
          montantSolde
        },
        items
      });
    }
  };
  
  // Changer le type de pro
  const handleProChange = (proType) => {
    setFormState({
      ...formState,
      devis: {
        ...formState.devis,
        proType
      }
    });
    
    // Mettre à jour le prix en fonction du nouveau type de pro
    updatePriceFromDossierType(formState.devis.typeDossier);
  };
  
  // Calculer les totaux
  const calculateTotals = () => {
    const montantHT = formState.items.reduce(
      (total, item) => total + parseFloat(item.totalHT), 0
    ).toFixed(2);
    
    const tauxTVA = parseFloat(formState.devis.tauxTVA);
    const montantTVA = (parseFloat(montantHT) * tauxTVA / 100).toFixed(2);
    const montantTTC = (parseFloat(montantHT) + parseFloat(montantTVA)).toFixed(2);
    const acomptePercent = parseFloat(formState.devis.acompte);
    const montantAcompte = (parseFloat(montantTTC) * acomptePercent / 100).toFixed(2);
    const montantSolde = (parseFloat(montantTTC) - parseFloat(montantAcompte)).toFixed(2);
    
    setFormState({
      ...formState,
      devis: {
        ...formState.devis,
        montantHT,
        montantTVA,
        montantTTC,
        montantAcompte,
        montantSolde
      }
    });
  };

  // Gestion de la sélection d'un client
  const selectClient = (client) => {
    setFormState({
      ...formState,
      client: {
        id: client.id,
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse
      }
    });
    
    if (client.type === 'professionnel') {
      setClientType('professionnel');
      // Si le client est pro, on peut mettre à jour le type de pro automatiquement
      // Logique pour déterminer le type de pro en fonction du nom
      const proTypeMapping = {
        'ARCADIA': 'arcadia',
        'COMBLE DF': 'comble-df',
        'ECA': 'eca',
        'GROUPE APB': 'groupe-apb',
        // Ajouter d'autres mappings au besoin
      };
      
      // Trouver une correspondance dans le nom
      let foundProType = 'particulier';
      for (const [key, value] of Object.entries(proTypeMapping)) {
        if (client.nom.includes(key)) {
          foundProType = value;
          break;
        }
      }
      
      handleProChange(foundProType);
    }
    
    setShowClientSearchModal(false);
  };

  // Gestion de la sélection d'un modèle
  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsUsingTemplate(true);
    
    // Logique pour charger les détails du modèle
    if (template.type === 'professionnel') {
      setClientType('professionnel');
      // Vous pouvez ajouter ici la logique pour pré-remplir les champs selon le modèle
    }
  };

  // Mise à jour de la date de validité lorsque le nombre de jours change
  useEffect(() => {
    if (formState.devis.validite && formState.devis.date) {
      const newValidityDate = calculateValidityDate(formState.devis.date, formState.devis.validite);
      setFormState({
        ...formState,
        devis: {
          ...formState.devis,
          dateValidite: newValidityDate
        }
      });
    }
  }, [formState.devis.validite, formState.devis.date]);

  // Générer un nouveau numéro de devis
  const generateNewDevisNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    // Dans une application réelle, vous devriez rechercher le dernier numéro dans la base de données
    const random = Math.floor(Math.random() * 900) + 100; // Simuler une séquence
    return `DEV-${year}-${random}`;
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
            <a href="#" className="px-1 py-4 text-sm text-blue-600 border-b-2 border-blue-500 font-medium">Comptabilité</a>
            <a href="#" className="px-1 py-4 text-sm text-gray-600 border-b-2 border-transparent hover:text-gray-800">Administration</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">David</span>
            <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded-md">Déconnexion</button>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        {/* En-tête avec titre */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button className="mr-4 p-2 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau devis</h1>
              <p className="text-gray-500">Création d'un devis pour un client</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2">
              <Save size={16} />
              <span>Enregistrer brouillon</span>
            </button>
            <button 
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={16} />
              <span>{showPreview ? "Modifier" : "Aperçu"}</span>
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2">
              <Download size={16} />
              <span>Exporter PDF</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Send size={16} />
              <span>Envoyer au client</span>
            </button>
          </div>
        </div>
        
        {/* Quick action bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">N° Devis:</span>
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{formState.devis.numero}</span>
              <button 
                className="p-1 text-gray-400 hover:text-blue-600 rounded" 
                title="Générer un nouveau numéro"
                onClick={() => {
                  const newDevisNumber = generateNewDevisNumber();
                  setFormState({
                    ...formState,
                    devis: {
                      ...formState.devis,
                      numero: newDevisNumber
                    }
                  });
                }}
              >
                <RefreshIcon size={16} />
              </button>
            </div>
            <div className="h-6 border-r border-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                  value={clientType}
                  onChange={(e) => {
                    setClientType(e.target.value);
                    if (e.target.value === 'particulier') {
                      handleProChange('particulier');
                    }
                  }}
                >
                  <option value="particulier">Particulier</option>
                  <option value="professionnel">Professionnel</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center gap-1.5"
              onClick={() => setShowClientSearchModal(true)}
            >
              <Users size={16} />
              <span>Chercher un client</span>
            </button>
            
            <div className="h-6 border-r border-gray-200"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Modèle:</span>
              <div className="relative">
                <select
                  className={`pl-3 pr-8 py-1.5 text-sm border ${isUsingTemplate ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                  value={selectedTemplate?.id || ''}
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    if (template) {
                      selectTemplate(template);
                    } else {
                      setIsUsingTemplate(false);
                      setSelectedTemplate(null);
                    }
                  }}
                >
                  <option value="">Aucun modèle</option>
                  {templates
                    .filter(template => template.type === clientType || template.type === 'all')
                    .map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))
                  }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bannière d'information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <Info className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-800 text-sm">
              {clientType === 'particulier' 
                ? "Vous créez un devis pour un particulier. Les prix sont calculés selon la grille tarifaire standard." 
                : "Vous créez un devis pour un professionnel. Des remises spécifiques seront appliquées automatiquement selon le type de professionnel sélectionné."}
            </p>
          </div>
        </div>
        
        {/* Affichage du mode aperçu */}
        {showPreview ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between mb-8">
              <div>
                <div className="h-12 w-32 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500">LOGO</div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">SARL DTAHC</p>
                  <p className="text-gray-600">13 rue René Laenec - 78 3310 COIGNIERES</p>
                  <p className="text-gray-600">Tél. : 01.30.49.25.18 - Email : permis@construires.fr</p>
                  <p className="text-gray-600">Site : www.construires.fr</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">DEVIS</h1>
                <p className="text-gray-700">{formState.devis.numero}</p>
                <p className="text-gray-700">Date: {formState.devis.date}</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">CLIENT</h2>
              <div className="text-gray-700">
                <p className="font-medium">{formState.client.nom || "[Nom du client]"}</p>
                <p>{formState.client.adresse || "[Adresse du client]"}</p>
                <p>Email: {formState.client.email || "[Email du client]"}</p>
                <p>Téléphone: {formState.client.telephone || "[Téléphone du client]"}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">DESCRIPTION</h2>
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formState.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm text-gray-800 whitespace-pre-line">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.quantite}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.unite}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right">{parseFloat(item.prixUnitaire).toFixed(2)} €</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right">{parseFloat(item.totalHT).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end mb-6">
              <div className="w-64 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total HT:</span>
                  <span className="text-sm font-medium">{formState.devis.montantHT} €</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">TVA ({formState.devis.tauxTVA}%):</span>
                  <span className="text-sm font-medium">{formState.devis.montantTVA} €</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="text-sm font-medium text-gray-700">Total TTC:</span>
                  <span className="text-base font-bold text-blue-700">{formState.devis.montantTTC} €</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">CONDITIONS DE PAIEMENT</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="mb-2 text-sm"><span className="font-medium">Acompte:</span> {formState.devis.acompte}% à la signature, soit {formState.devis.montantAcompte} €</p>
                <p className="mb-2 text-sm"><span className="font-medium">Solde:</span> {100 - formState.devis.acompte}% à la livraison, soit {formState.devis.montantSolde} €</p>
                <p className="mb-2 text-sm"><span className="font-medium">Validité du devis:</span> {formState.devis.validite} jours, jusqu'au {formState.devis.dateValidite}</p>
                <p className="text-sm"><span className="font-medium">Méthodes de paiement acceptées:</span> Virement bancaire, Chèque</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">NOTES</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {formState.notes.map((note, index) => (
                  <p key={note.id} className="text-gray-700 text-sm mb-2">{note.text}</p>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6">
              <p className="font-semibold mb-1">Conditions Générales de Vente (extrait):</p>
              <p className="mb-1">1. Objet: Ces conditions régissent les ventes de services d'aide à la réalisation de dossiers d'autorisation.</p>
              <p className="mb-1">2. Paiement: Un acompte de 30% est requis à la commande, le solde avant livraison. Par virement ou chèque uniquement.</p>
              <p className="mb-1">3. Délai de livraison: Indicatif, débute à réception de l'acompte et des documents nécessaires.</p>
              <p>Pour consulter l'intégralité des CGV, veuillez vous référer au document joint ou disponible sur notre site.</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">IBAN : FR76 3000 3027 6600 0200 0913 453</p>
                  <p className="text-sm font-medium text-gray-700">BIC : SOGEFRPP</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Signature du client:</p>
                  <div className="border border-gray-300 rounded h-24 w-48"></div>
                  <p className="text-xs text-gray-600 mt-1">(Mentions "lu et approuvé", bon pour commande et acceptation des modalités de paiement")</p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
                <p>SARL au capital de 2 000 euros - RCS : Versailles - N°TVA : FR79530690676</p>
                <p>Siret : 530 690 676 00016 - SIREN : 530 690 676 - APE : 711B</p>
              </div>
            </div>
          </div>
        ) : (
          // Affichage du mode édition (formulaire)
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Colonne de gauche: informations client */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  <span>Informations client</span>
                  <button 
                    className="text-blue-600 text-sm font-normal hover:text-blue-800 flex items-center gap-1"
                    onClick={() => setShowClientSearchModal(true)}
                  >
                    <Users size={16} />
                    <span>Chercher un client</span>
                  </button>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="particulier"
                          checked={clientType === 'particulier'}
                          onChange={() => {
                            setClientType('particulier');
                            handleProChange('particulier');
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Particulier</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="professionnel"
                          checked={clientType === 'professionnel'}
                          onChange={() => {
                            setClientType('professionnel');
                            setShowTarificationOptions(true);
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Professionnel</span>
                      </label>
                    </div>
                  </div>
                  
                  {clientType === 'professionnel' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type professionnel</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formState.devis.proType}
                        onChange={(e) => handleProChange(e.target.value)}
                      >
                        {proOptions.filter(p => p.id !== 'particulier').map((pro) => (
                          <option key={pro.id} value={pro.id}>
                            {pro.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {clientType === 'particulier' ? 'Nom et prénom' : 'Raison sociale'}
                    </label>
                    <input
                      type="text"
                      value={formState.client.nom}
                      onChange={(e) => setFormState({
                        ...formState,
                        client: { ...formState.client, nom: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={clientType === 'particulier' ? 'Jean Dupont' : 'Entreprise ABC'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formState.client.email}
                        onChange={(e) => setFormState({
                          ...formState,
                          client: { ...formState.client, email: e.target.value }
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formState.client.telephone}
                        onChange={(e) => setFormState({
                          ...formState,
                          client: { ...formState.client, telephone: e.target.value }
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <textarea
                      value={formState.client.adresse}
                      onChange={(e) => setFormState({
                        ...formState,
                        client: { ...formState.client, adresse: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 Rue Principale, 75001 Paris"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations devis</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">N° Devis</label>
                      <input
                        type="text"
                        value={formState.devis.numero}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date émission</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formState.devis.date}
                          onChange={(e) => setFormState({
                            ...formState,
                            devis: { ...formState.devis, date: e.target.value }
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validité (jours)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={formState.devis.validite}
                          onChange={(e) => setFormState({
                            ...formState,
                            devis: { ...formState.devis, validite: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date validité</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formState.devis.dateValidite}
                          readOnly
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de tarification</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="grid"
                          checked={pricingMethod === 'grid'}
                          onChange={() => setPricingMethod('grid')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Grille tarifaire</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="manual"
                          checked={pricingMethod === 'manual'}
                          onChange={() => setPricingMethod('manual')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Manuel</span>
                      </label>
                    </div>
                  </div>
                  
                  {pricingMethod === 'grid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type de dossier</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formState.devis.typeDossier}
                        onChange={(e) => updatePriceFromDossierType(e.target.value)}
                      >
                        {tarifOptions.map((tarif) => (
                          <option key={tarif.id} value={tarif.id}>
                            {tarif.label} - {tarif.price} € (délai: {tarif.delai})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taux TVA (%)</label>
                      <input
                        type="number"
                        value={formState.devis.tauxTVA}
                        onChange={(e) => setFormState({
                          ...formState,
                          devis: { ...formState.devis, tauxTVA: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acompte (%)</label>
                      <input
                        type="number"
                        value={formState.devis.acompte}
                        onChange={(e) => setFormState({
                          ...formState,
                          devis: { ...formState.devis, acompte: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Délai de paiement (jours)</label>
                    <input
                      type="number"
                      value={formState.devis.delaiPaiement}
                      onChange={(e) => setFormState({
                        ...formState,
                        devis: { ...formState.devis, delaiPaiement: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Colonne de droite: contenu du devis */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  <span>Contenu du devis</span>
                  <div className="flex gap-3">
                    <button 
                      className="text-blue-600 text-sm font-normal hover:text-blue-800 flex items-center gap-1"
                      onClick={() => setShowCommonElements(true)}
                    >
                      <Plus size={16} />
                      <span>Textes courants</span>
                    </button>
                    <button 
                      className="text-blue-600 text-sm font-normal hover:text-blue-800 flex items-center gap-1"
                      onClick={calculateTotals}
                    >
                      <Calculator size={16} />
                      <span>Recalculer</span>
                    </button>
                  </div>
                </h2>
                
                {/* Tableau des éléments */}
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Quantité</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Unité</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Prix unitaire</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Remise %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Total HT</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formState.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2">
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...formState.items];
                                newItems[index].description = e.target.value;
                                setFormState({ ...formState, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              rows={3}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantite}
                              onChange={(e) => {
                                const newItems = [...formState.items];
                                newItems[index].quantite = parseInt(e.target.value) || 0;
                                newItems[index].totalHT = (newItems[index].quantite * parseFloat(newItems[index].prixUnitaire) * (1 - newItems[index].remise / 100)).toFixed(2);
                                setFormState({ ...formState, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={item.unite}
                              onChange={(e) => {
                                const newItems = [...formState.items];
                                newItems[index].unite = e.target.value;
                                setFormState({ ...formState, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="forfait">Forfait</option>
                              <option value="heure">Heure</option>
                              <option value="jour">Jour</option>
                              <option value="unité">Unité</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.prixUnitaire}
                              onChange={(e) => {
                                const newItems = [...formState.items];
                                newItems[index].prixUnitaire = e.target.value;
                                newItems[index].totalHT = (newItems[index].quantite * parseFloat(e.target.value) * (1 - newItems[index].remise / 100)).toFixed(2);
                                setFormState({ ...formState, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-right"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.remise}
                              onChange={(e) => {
                                const newItems = [...formState.items];
                                newItems[index].remise = parseInt(e.target.value) || 0;
                                newItems[index].totalHT = (newItems[index].quantite * parseFloat(newItems[index].prixUnitaire) * (1 - newItems[index].remise / 100)).toFixed(2);
                                setFormState({ ...formState, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-right"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.totalHT}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-right bg-gray-50"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mb-6">
                  <button 
                    onClick={addItem}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>
                
                {/* Récapitulatif financier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Modalités de paiement</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Acompte ({formState.devis.acompte}%)</span>
                          <span className="font-medium">{formState.devis.montantAcompte} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Solde à régler</span>
                          <span className="font-medium">{formState.devis.montantSolde} €</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                          <span className="text-gray-600">Délai de paiement</span>
                          <span className="font-medium">{formState.devis.delaiPaiement} jours</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs">
                          <FileText size={14} className="text-green-500" />
                          <span>Virement bancaire</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs">
                          <Check size={14} className="text-purple-500" />
                          <span>Chèque</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Récapitulatif</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total HT</span>
                          <span className="font-medium">{formState.devis.montantHT} €</span>
                        </div>
                        {parseFloat(formState.devis.remise) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Remise client ({formState.devis.remise}%)</span>
                            <span className="font-medium text-green-600">-{(parseFloat(formState.devis.montantHT) * parseFloat(formState.devis.remise) / 100).toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TVA ({formState.devis.tauxTVA}%)</span>
                          <span className="font-medium">{formState.devis.montantTVA} €</span>
                        </div>
                        <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-300">
                          <span>Total TTC</span>
                          <span className="text-blue-600">{formState.devis.montantTTC} €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes et conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
                  <span>Notes et conditions</span>
                  <button 
                    className="text-blue-600 text-sm font-normal hover:text-blue-800 flex items-center gap-1"
                    onClick={() => setNewNoteVisible(!newNoteVisible)}
                  >
                    <Plus size={16} />
                    <span>Ajouter une note</span>
                  </button>
                </h2>
                
                <div className="space-y-4">
                  {/* Notes actuelles */}
                  {formState.notes.map((note, index) => (
                    <div key={note.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex-grow">
                        <p className="text-sm text-gray-700">{note.text}</p>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-500 p-1"
                        onClick={() => removeNote(note.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Formulaire pour ajouter une nouvelle note */}
                  {newNoteVisible && (
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                        rows={2}
                        placeholder="Saisissez votre note ici..."
                        autoFocus
                        id="newNoteText"
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                          onClick={() => setNewNoteVisible(false)}
                        >
                          Annuler
                        </button>
                        <button 
                          className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          onClick={() => {
                            const noteText = document.getElementById('newNoteText').value;
                            if (noteText.trim()) {
                              addNote(noteText);
                            }
                          }}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked={true} />
                      <span className="ml-2 text-sm text-gray-700">Inclure les conditions générales de vente</span>
                    </label>
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                      <p className="mb-1">Les CGV complètes seront incluses en fin de document. Un extrait est visible en aperçu.</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked={true} />
                      <span className="ml-2 text-sm text-gray-700">Autoriser la signature électronique du devis</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Boutons d'action en bas */}
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2">
            <X size={16} />
            <span>Annuler</span>
          </button>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2">
              <Save size={16} />
              <span>Enregistrer brouillon</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Check size={16} />
              <span>Créer le devis</span>
            </button>
          </div>
        </div>
        
        {/* Modal pour les options de tarification pro */}
        {showTarificationOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Options de tarification professionnel</h3>
              
              <p className="text-gray-600 mb-4">
                Sélectionnez le type de professionnel pour appliquer automatiquement les remises associées.
              </p>
              
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {proOptions.filter(p => p.id !== 'particulier').map((pro) => (
                  <label key={pro.id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="proType"
                      value={pro.id}
                      checked={formState.devis.proType === pro.id}
                      onChange={() => handleProChange(pro.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 flex-1">{pro.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium"
                  onClick={() => {
                    setShowTarificationOptions(false);
                    setClientType('particulier');
                    handleProChange('particulier');
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => setShowTarificationOptions(false)}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal pour la recherche de client */}
        {showClientSearchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Rechercher un client</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowClientSearchModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, téléphone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Clients récents</h4>
                <div className="space-y-2">
                  {recentClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectClient(client)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{client.nom}</p>
                          <p className="text-sm text-gray-500">{client.email} | {client.telephone}</p>
                          <p className="text-sm text-gray-500 mt-1">{client.adresse}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${client.type === 'particulier' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {client.type === 'particulier' ? 'Particulier' : 'Professionnel'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium"
                  onClick={() => setShowClientSearchModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => setShowClientSearchModal(false)}
                >
                  Créer un nouveau client
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal pour les éléments communs de description */}
        {showCommonElements && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Textes courants</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCommonElements(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Sélectionnez un élément à ajouter à votre devis:
                </p>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {commonElements.map((element) => (
                    <div
                      key={element.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addCommonElement(element)}
                    >
                      <p className="font-medium text-gray-800">{element.title}</p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{element.text.length > 100 ? element.text.substring(0, 100) + '...' : element.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium"
                  onClick={() => setShowCommonElements(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Icon component for the refresh button
const RefreshIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6"></path>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M3 22v-6h6"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
  </svg>
);

export default CreationDevisOptimise;