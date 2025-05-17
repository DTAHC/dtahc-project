import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Download, Send, Plus, Minus, X, 
  Calculator, Check, Users, Mail, Phone, 
  Calendar, FileText, HelpCircle, Info, DollarSign,
  Clock, Link, AlertCircle, Search, Eye, Filter,
  List, Menu, PlusCircle
} from 'lucide-react';

const CreationFactureOptimise = () => {
  // États principaux
  const [clientType, setClientType] = useState('particulier');
  const [paymentStatus, setPaymentStatus] = useState('en_attente');
  const [selectedDevis, setSelectedDevis] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClientSearchModal, setShowClientSearchModal] = useState(false);
  const [showDevisSearchModal, setShowDevisSearchModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [factureType, setFactureType] = useState('complete'); // 'complete', 'acompte', 'solde'
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCGVModal, setShowCGVModal] = useState(false);
  
  // Options de facture
  const factureTypes = [
    { id: 'complete', label: 'Facture complète' },
    { id: 'acompte', label: 'Facture d\'acompte' },
    { id: 'solde', label: 'Facture de solde' }
  ];
  
  // Templates pour les descriptions
  const descriptionTemplates = [
    {
      id: 'pc',
      title: 'Permis de Construire',
      content: 'Réalisation d\'un dossier de Permis de Construire'
    },
    {
      id: 'dpravaux',
      title: 'DP Travaux',
      content: 'Réalisation d\'un dossier de Déclaration Préalable de travaux'
    },
    {
      id: 'pieces_standard',
      title: 'Pièces de dossier standard',
      content: 'Les pièces du dossier qui vous sera transmis par mail Format A3/A4 : \n- Page de garde \n- Sommaire \n- DP/PCMI 1 Plan de situation \n- DP/PCMI 2 Plan de masse \n- DP/PCMI 3 Coupe sur terrain \n- DP/PCMI 4 Notice \n- DP/PCMI 5 Plan de Façades \n- DP/PCMI 6 7 8 Volet paysager \n- Bordereau Cerfa'
    },
    {
      id: 'attestation_thermique',
      title: 'Attestation thermique',
      content: 'Attestation thermique RE 2020'
    },
    {
      id: 'mesures',
      title: 'Relevé de mesures',
      content: 'L\'ensemble des prises de mesures, cotes recueillies afin de réaliser des plans au format papier ou numérique'
    },
    {
      id: 'dp_fenetre',
      title: 'DP Fenêtre',
      content: 'Déclaration préalable pour changement de fenêtres'
    },
    {
      id: 'suivi_administratif',
      title: 'Suivi administratif',
      content: 'Frais de dépôt et suivi administratif'
    }
  ];
  
  // Clients récents
  const recentClients = [
    { id: 'CL-2025-042', nom: 'Dupont Jean', email: 'jean.dupont@example.com', telephone: '06 12 34 56 78', adresse: '123 Rue Principale, 75001 Paris', type: 'particulier' },
    { id: 'CL-2025-039', nom: 'Martin Sophie', email: 'sophie.martin@example.com', telephone: '07 22 33 44 55', adresse: '45 Avenue des Fleurs, 75015 Paris', type: 'particulier' },
    { id: 'CL-2025-038', nom: 'ARCADIA MEGACOMBLES', email: 'contact@arcadia.fr', telephone: '01 23 45 67 89', adresse: '30 Av. Robert Surcouf, 78960 Voisins-le Bretonneux', type: 'professionnel' },
    { id: 'CL-2025-037', nom: 'GROUPE APB', email: 'mairie@groupe-apb.fr', telephone: '09 80 80 40 04', adresse: '72 Rue de Paris, 75005 Paris', type: 'professionnel' }
  ];
  
  // Devis récents pour la recherche
  const recentDevis = [
    { id: 'DEV-2025-047', client: 'Dupont Jean', date: '10/05/2025', montant: '1140.00', typeDossier: 'DP FENETRE' },
    { id: 'DEV-2025-046', client: 'ARCADIA MEGACOMBLES', date: '09/05/2025', montant: '2044.00', typeDossier: 'PC+RT' },
    { id: 'DEV-2025-045', client: 'Martin Sophie', date: '08/05/2025', montant: '950.00', typeDossier: 'DP ITE' },
    { id: 'DEV-2025-044', client: 'GROUPE APB', date: '07/05/2025', montant: '13075.20', typeDossier: 'Multiple' }
  ];
  
  // Conditions générales de vente
  const cgvComplete = `Conditions Générales de Vente de DTAHC

1. Objet : Ces conditions régissent les ventes de services d'aide à la réalisation de dossiers d'autorisation, comme les permis de construire.

2. Prix : Fixés hors taxes au jour de la commande, ajustables selon la TVA applicable.

3. Paiement : Un acompte de 30% est requis à la commande, le solde avant livraison. Par virement.
Pour les clients professionnels, paiement sous 30 jours à réception de la facture.

4. Retard de Paiement : Pénalité de retard à trois fois le taux d'intérêt légal. Indemnité forfaitaire de 40 euros pour frais de recouvrement.

5. Livraison : Les services finaux sont délivrés directement au client ou par envoi électronique.
Le délai de livraison indiqué lors de la prise de commande n'est donné qu'à titre indicatif.

6. Limitation de Responsabilité : La responsabilité de DTAHC se limite aux montants payés pour les services. Non responsable pour des attentes ou informations hors expertise.

7. Responsabilité du Client : Le client garantit l'exactitude des informations fournies en accord avec les articles L111-1 et suivants et la conformité des travaux. Responsabilité de DTAHC limitée au montant payé.

8. Exclusions : Services pour fins d'aide administratives, et non à la construction. et ne garantissent pas l'obtention de l'autorisation demandée, décision relevant de l'autorité compétente.

9. Force Majeure : Non-responsabilité pour retard ou non-exécution causés par des événements extérieurs imprévisibles.

10. Litiges : Soumis au droit français. En absence d'accord, litiges traités par le Tribunal de Commerce de Versailles.`;

  // État du formulaire
  const [formState, setFormState] = useState({
    client: {
      id: 'CL-2025-042',
      nom: 'Dupont Jean',
      email: 'jean.dupont@example.com',
      telephone: '06 12 34 56 78',
      adresse: '123 Rue Principale, 75001 Paris'
    },
    facture: {
      numero: 'FAC-2025-048',
      date: getFormattedCurrentDate(),
      dateEcheance: calculateDueDate(getFormattedCurrentDate(), 30),
      devisAssocie: 'DEV-2025-042',
      referenceDossier: 'DOS-2025-042',
      typeDossier: 'DP FENETRE',
      tauxTVA: 20,
      montantHT: '950.00',
      montantTVA: '190.00',
      montantTTC: '1140.00',
      montantAcompte: '342.00',
      montantSolde: '798.00',
      statue: factureType
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
    paiement: {
      statut: 'en_attente',
      date: '',
      methode: 'virement',
      reference: '',
      montantPaye: '0.00',
      notes: ''
    },
    notes: [
      {
        id: 1, 
        text: "Merci pour votre confiance. Les paiements doivent être effectués avant la date d'échéance indiquée."
      }
    ],
    includeCGV: true
  });
  
  // Fonctions utilitaires
  function getFormattedCurrentDate() {
    const date = new Date();
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  function calculateDueDate(dateStr, days) {
    const parts = dateStr.split('/');
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    date.setDate(date.getDate() + parseInt(days));
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  // Ajouter un élément à la facture
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
  
  // Supprimer un élément de la facture
  const removeItem = (id) => {
    setFormState({
      ...formState,
      items: formState.items.filter(item => item.id !== id)
    });
  };
  
  // Calculer les totaux
  const calculateTotals = () => {
    const montantHT = formState.items.reduce(
      (total, item) => total + parseFloat(item.totalHT), 0
    ).toFixed(2);
    
    const tauxTVA = parseFloat(formState.facture.tauxTVA);
    const montantTVA = (parseFloat(montantHT) * tauxTVA / 100).toFixed(2);
    const montantTTC = (parseFloat(montantHT) + parseFloat(montantTVA)).toFixed(2);
    
    // Si c'est une facture d'acompte
    let montantAcompte = formState.facture.montantAcompte;
    let montantSolde = formState.facture.montantSolde;
    
    if (factureType === 'acompte') {
      montantAcompte = montantTTC;
      montantSolde = '0.00';
    } else if (factureType === 'solde') {
      montantAcompte = '0.00';
      montantSolde = montantTTC;
    } else {
      // Facture complète
      montantAcompte = '0.00';
      montantSolde = '0.00';
    }
    
    setFormState({
      ...formState,
      facture: {
        ...formState.facture,
        montantHT,
        montantTVA,
        montantTTC,
        montantAcompte,
        montantSolde,
        statue: factureType
      }
    });
  };
  
  // Mise à jour de la date d'échéance lorsque la date change
  useEffect(() => {
    if (formState.facture.date) {
      const newEcheanceDate = calculateDueDate(formState.facture.date, 30);
      setFormState({
        ...formState,
        facture: {
          ...formState.facture,
          dateEcheance: newEcheanceDate
        }
      });
    }
  }, [formState.facture.date]);
  
  // Mettre à jour le type de facturation
  useEffect(() => {
    setFormState({
      ...formState,
      facture: {
        ...formState.facture,
        statue: factureType
      }
    });
  }, [factureType]);
  
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
    } else {
      setClientType('particulier');
    }
    
    setShowClientSearchModal(false);
  };
  
  // Gestion de la sélection d'un devis
  const selectDevis = (devis) => {
    // En réalité, vous récupéreriez toutes les données du devis de la base de données
    // Ici, nous simulons simplement en mettant à jour certains champs
    setFormState({
      ...formState,
      facture: {
        ...formState.facture,
        devisAssocie: devis.id,
        montantHT: (parseFloat(devis.montant) / 1.2).toFixed(2),
        montantTVA: (parseFloat(devis.montant) - parseFloat(devis.montant) / 1.2).toFixed(2),
        montantTTC: devis.montant,
        typeDossier: devis.typeDossier
      }
    });
    
    // Trouver le client associé
    const client = recentClients.find(c => c.nom === devis.client);
    if (client) {
      selectClient(client);
    }
    
    setSelectedDevis(true);
    setShowDevisSearchModal(false);
  };
  
  // Enregistrer un paiement
  const enregistrerPaiement = (paiementData) => {
    setFormState({
      ...formState,
      paiement: {
        ...paiementData,
        statut: 'paye'
      }
    });
    
    setPaymentStatus('paye');
    setShowPaymentModal(false);
  };

  // Générer un nouveau numéro de facture
  const generateNewFactureNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    // Dans une application réelle, vous devriez rechercher le dernier numéro dans la base de données
    const random = Math.floor(Math.random() * 900) + 100; // Simuler une séquence
    return `FAC-${year}-${random}`;
  };
  
  // Ajouter un template de description à un élément
  const addTemplateToItem = (itemId, template) => {
    const newItems = [...formState.items];
    const itemIndex = newItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      newItems[itemIndex].description = template.content;
      setFormState({
        ...formState,
        items: newItems
      });
    }
    
    setShowTemplateModal(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture</h1>
              <p className="text-gray-500">Création d'une facture pour un client</p>
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
              <span className="text-sm font-medium text-gray-700">N° Facture:</span>
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{formState.facture.numero}</span>
              <button 
                className="p-1 text-gray-400 hover:text-blue-600 rounded" 
                title="Générer un nouveau numéro"
                onClick={() => {
                  const newFactureNumber = generateNewFactureNumber();
                  setFormState({
                    ...formState,
                    facture: {
                      ...formState.facture,
                      numero: newFactureNumber
                    }
                  });
                }}
              >
                <RefreshIcon size={16} />
              </button>
            </div>
            <div className="h-6 border-r border-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type de facture:</span>
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                  value={factureType}
                  onChange={(e) => setFactureType(e.target.value)}
                >
                  {factureTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
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
            
            <button 
              className={`px-3 py-1.5 text-sm ${selectedDevis ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'} rounded-md border hover:bg-opacity-75 flex items-center gap-1.5`}
              onClick={() => setShowDevisSearchModal(true)}
            >
              <FileText size={16} />
              <span>{selectedDevis ? 'Devis lié: ' + formState.facture.devisAssocie : 'Lier un devis'}</span>
            </button>
          </div>
        </div>
        
        {/* Bannière d'information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <Info className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            {selectedDevis ? (
              <p className="text-blue-800 text-sm">
                Cette facture est basée sur le devis <span className="font-medium">{formState.facture.devisAssocie}</span>. 
                Vous pouvez modifier les éléments ou ajuster les montants si nécessaire. Pour enregistrer un paiement, utilisez 
                l'option après avoir créé la facture.
              </p>
            ) : (
              <p className="text-blue-800 text-sm">
                Vous créez une facture sans devis associé. Veuillez remplir manuellement les informations nécessaires.
              </p>
            )}
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">FACTURE</h1>
                <p className="text-gray-700">{formState.facture.numero}</p>
                <p className="text-gray-700">Date: {formState.facture.date}</p>
                <p className="text-gray-700">Échéance: {formState.facture.dateEcheance}</p>
                {selectedDevis && (
                  <p className="text-sm text-blue-600 mt-2">Réf. Devis: {formState.facture.devisAssocie}</p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">CLIENT</h2>
              <div className="text-gray-700">
                <p className="font-medium">{formState.client.nom}</p>
                <p>{formState.client.adresse}</p>
                <p>Email: {formState.client.email}</p>
                <p>Téléphone: {formState.client.telephone}</p>
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
                  <span className="text-sm font-medium">{formState.facture.montantHT} €</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">TVA ({formState.facture.tauxTVA}%):</span>
                  <span className="text-sm font-medium">{formState.facture.montantTVA} €</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="text-sm font-medium text-gray-700">Total TTC:</span>
                  <span className="text-base font-bold text-blue-700">{formState.facture.montantTTC} €</span>
                </div>
              </div>
            </div>
            
            {factureType !== 'complete' && (
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {factureType === 'acompte' ? (
                    <p className="text-gray-700 font-medium">Cette facture représente l'acompte de {formState.facture.montantTTC} €</p>
                  ) : (
                    <div>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Acompte déjà versé: </span>
                        {formState.facture.montantAcompte} €
                      </p>
                      <p className="text-gray-700 font-medium">Cette facture représente le solde de {formState.facture.montantSolde} €</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">CONDITIONS DE PAIEMENT</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm"><span className="font-medium">Date d'échéance:</span> {formState.facture.dateEcheance}</p>
                <p className="text-sm mt-1"><span className="font-medium">Méthodes de paiement acceptées:</span> Virement bancaire, Chèque</p>
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
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">IBAN : FR76 3000 3027 6600 0200 0913 453</p>
                <p className="text-sm font-medium text-gray-700">BIC : SOGEFRPP</p>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
                <p>SARL au capital de 2 000 euros - RCS : Versailles - N°TVA : FR79530690676</p>
                <p>Siret : 530 690 676 00016 - SIREN : 530 690 676 - APE : 711B</p>
                {formState.includeCGV && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-700 text-xs font-medium mb-1">Conditions Générales de Vente :</p>
                    <p className="text-gray-500 text-xs leading-tight">
                      1. Objet: Conditions régissant ventes de services d'aide à la réalisation de dossiers d'autorisation.
                      2. Prix: Fixés HT au jour de commande, ajustables selon TVA applicable.
                      3. Paiement: Acompte 30% à commande, solde avant livraison. Par virement. Professionnels: 30j.
                      4. Retard: Pénalité à 3× taux légal. Indemnité 40€ pour recouvrement.
                      5. Livraison: Directe ou électronique. Délai indicatif.
                      6. Limitation: Responsabilité limitée aux montants payés.
                      7. Client: Garantit exactitude des informations selon L111-1 et suivants.
                      8. Exclusions: Services administratifs, non garantie d'autorisation.
                      9. Force Majeure: Non-responsabilité pour événements imprévisibles.
                      10. Litiges: Droit français. Tribunal de Commerce de Versailles.
                    </p>
                  </div>
                )}
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
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-700">ID Client</div>
                    <div className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{formState.client.id}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Raison sociale</label>
                    <input
                      type="text"
                      value={formState.client.nom}
                      onChange={(e) => setFormState({
                        ...formState,
                        client: { ...formState.client, nom: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={selectedDevis}
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
                        disabled={selectedDevis}
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
                        disabled={selectedDevis}
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
                      rows={3}
                      disabled={selectedDevis}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  <span>Informations facture</span>
                  {selectedDevis && (
                    <div className="flex items-center text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      <Link size={14} className="mr-1" />
                      <span>Lié au devis</span>
                    </div>
                  )}
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">N° Facture</label>
                      <input
                        type="text"
                        value={formState.facture.numero}
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
                          value={formState.facture.date}
                          onChange={(e) => setFormState({
                            ...formState,
                            facture: { ...formState.facture, date: e.target.value }
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Échéance (jours)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date échéance</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formState.facture.dateEcheance}
                          readOnly
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Devis associé</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formState.facture.devisAssocie}
                        readOnly={selectedDevis}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${selectedDevis ? 'bg-gray-50' : ''}`}
                      />
                      <button 
                        className="ml-2 p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                        onClick={() => setShowDevisSearchModal(true)}
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Référence dossier</label>
                    <input
                      type="text"
                      value={formState.facture.referenceDossier}
                      onChange={(e) => setFormState({
                        ...formState,
                        facture: { ...formState.facture, referenceDossier: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de dossier</label>
                    <input
                      type="text"
                      value={formState.facture.typeDossier}
                      onChange={(e) => setFormState({
                        ...formState,
                        facture: { ...formState.facture, typeDossier: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de facture</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="factureType"
                          value="complete"
                          checked={factureType === 'complete'}
                          onChange={() => setFactureType('complete')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Complète</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="factureType"
                          value="acompte"
                          checked={factureType === 'acompte'}
                          onChange={() => setFactureType('acompte')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Acompte</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="factureType"
                          value="solde"
                          checked={factureType === 'solde'}
                          onChange={() => setFactureType('solde')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Solde</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut du paiement</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="paye">Payé</option>
                      <option value="partiel">Paiement partiel</option>
                      <option value="retard">En retard</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </div>
                  
                  {paymentStatus === 'paye' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        <span className="text-sm text-green-800 font-medium">Facture payée</span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-green-700">
                        <div>Date: {formState.paiement.date || formState.facture.date}</div>
                        <div>Méthode: {formState.paiement.methode === 'virement' ? 'Virement' : formState.paiement.methode}</div>
                      </div>
                      <button 
                        className="w-full mt-2 px-2 py-1 text-xs text-center border border-green-300 rounded bg-green-100 text-green-700 hover:bg-green-200"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        Voir détails
                      </button>
                    </div>
                  )}
                  
                  {paymentStatus === 'en_attente' && (
                    <button 
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <DollarSign size={16} />
                      <span>Enregistrer un paiement</span>
                    </button>
                  )}
                  
                  {paymentStatus === 'retard' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle size={16} className="text-red-600 mr-2" />
                        <span className="text-sm text-red-800 font-medium">Paiement en retard</span>
                      </div>
                      <div className="mt-2 text-xs text-red-700">
                        <div>Échéance dépassée depuis 5 jours</div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button 
                          className="flex-1 px-2 py-1 text-xs text-center border border-red-300 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          onClick={() => setShowPaymentModal(true)}
                        >
                          Enregistrer paiement
                        </button>
                        <button className="flex-1 px-2 py-1 text-xs text-center border border-red-300 rounded bg-red-100 text-red-700 hover:bg-red-200">
                          Envoyer relance
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Colonne de droite: contenu de la facture */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  <span>Contenu de la facture</span>
                  <div className="flex gap-2">
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
                            <div className="flex items-center">
                              <textarea
                                value={item.description}
                                onChange={(e) => {
                                  const newItems = [...formState.items];
                                  newItems[index].description = e.target.value;
                                  setFormState({ ...formState, items: newItems });
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                rows={2}
                              />
                              <button 
                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded"
                                onClick={() => setShowTemplateModal(item.id)}
                                title="Utiliser un template"
                              >
                                <List size={16} />
                              </button>
                            </div>
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Informations de paiement</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-3">
                        {factureType === 'acompte' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Montant acompte</span>
                              <span className="font-medium">{formState.facture.montantTTC} €</span>
                            </div>
                            <div className="pt-2 border-t border-gray-300">
                              <div className="text-xs text-gray-500 mb-1">Cette facture est un acompte sur le total du devis</div>
                            </div>
                          </>
                        )}
                        
                        {factureType === 'solde' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Acompte déjà versé</span>
                              <span className="font-medium">{formState.facture.montantAcompte} €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Solde à régler</span>
                              <span className="font-medium">{formState.facture.montantSolde} €</span>
                            </div>
                            <div className="pt-2 border-t border-gray-300">
                              <div className="text-xs text-gray-500 mb-1">Cette facture est le solde à régler</div>
                            </div>
                          </>
                        )}
                        
                        {factureType === 'complete' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Montant total à régler</span>
                              <span className="font-medium">{formState.facture.montantTTC} €</span>
                            </div>
                            <div className="pt-2 border-t border-gray-300">
                              <div className="text-xs text-gray-500 mb-1">Cette facture représente le montant total</div>
                            </div>
                          </>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date d'échéance</span>
                          <span className="font-medium">{formState.facture.dateEcheance}</span>
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
                    
                    {paymentStatus === 'en_attente' && (
                      <div className="mt-3 flex flex-col">
                        <button 
                          className="w-full px-3 py-2 mt-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2"
                          onClick={() => setShowPaymentModal(true)}
                        >
                          <DollarSign size={16} />
                          <span>Enregistrer un paiement</span>
                        </button>
                        <button className="w-full px-3 py-2 mt-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                          <Clock size={16} />
                          <span>Configurer paiement échelonné</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Récapitulatif</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total HT</span>
                          <span className="font-medium">{formState.facture.montantHT} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TVA ({formState.facture.tauxTVA}%)</span>
                          <span className="font-medium">{formState.facture.montantTVA} €</span>
                        </div>
                        <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-300">
                          <span>Total TTC</span>
                          <span className="text-blue-600">{formState.facture.montantTTC} €</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Statut de paiement</span>
                          {paymentStatus === 'en_attente' && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                              En attente
                            </span>
                          )}
                          {paymentStatus === 'paye' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Payé
                            </span>
                          )}
                          {paymentStatus === 'partiel' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Paiement partiel
                            </span>
                          )}
                          {paymentStatus === 'retard' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              En retard
                            </span>
                          )}
                          {paymentStatus === 'annule' && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Annulé
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes et conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes et conditions</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes pour le client</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Informations complémentaires pour le client..."
                      defaultValue="Merci pour votre confiance. Les paiements doivent être effectués avant la date d'échéance indiquée."
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600" 
                        checked={formState.includeCGV}
                        onChange={() => setFormState({...formState, includeCGV: !formState.includeCGV})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Inclure les conditions générales de vente</span>
                      <button 
                        className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded"
                        onClick={() => setShowCGVModal(true)}
                      >
                        <Eye size={14} />
                      </button>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked={true} />
                      <span className="ml-2 text-sm text-gray-700">Inclure les mentions légales obligatoires</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked={true} />
                      <span className="ml-2 text-sm text-gray-700">Inclure les informations bancaires</span>
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
              <span>Créer la facture</span>
            </button>
          </div>
        </div>
        
        {/* Modal pour l'enregistrement d'un paiement */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enregistrer un paiement</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue={formState.facture.montantTTC}
                      className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="virement">Virement bancaire</option>
                    <option value="cheque">Chèque</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence de paiement</label>
                  <input 
                    type="text" 
                    placeholder="Numéro de transaction, référence de chèque..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Notes supplémentaires sur le paiement..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => {
                    const paiementData = {
                      statut: 'paye',
                      date: new Date().toLocaleDateString('fr-FR'),
                      methode: 'virement',
                      reference: 'VIR-' + Math.floor(Math.random() * 10000),
                      montantPaye: formState.facture.montantTTC,
                      notes: ''
                    };
                    enregistrerPaiement(paiementData);
                  }}
                >
                  Enregistrer le paiement
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
        
        {/* Modal pour la recherche de devis */}
        {showDevisSearchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Rechercher un devis</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowDevisSearchModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro, client, montant..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Devis récents</h4>
                <div className="space-y-2">
                  {recentDevis.map((devis) => (
                    <div
                      key={devis.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectDevis(devis)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{devis.id} - {devis.client}</p>
                          <p className="text-sm text-gray-500">Date: {devis.date} | Type: {devis.typeDossier}</p>
                        </div>
                        <span className="text-sm font-medium text-blue-700">{devis.montant} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium"
                  onClick={() => {
                    setSelectedDevis(false);
                    setShowDevisSearchModal(false);
                  }}
                >
                  Créer sans devis
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => setShowDevisSearchModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal pour les templates de descriptions */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Sélectionner un template de description</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowTemplateModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {descriptionTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addTemplateToItem(showTemplateModal, template)}
                    >
                      <p className="font-medium text-gray-800 mb-1">{template.title}</p>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{template.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour afficher les CGV */}
        {showCGVModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Conditions Générales de Vente</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCGVModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-line">{cgvComplete}</pre>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => setShowCGVModal(false)}
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

export default CreationFactureOptimise;