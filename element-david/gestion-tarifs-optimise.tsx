import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, DollarSign, Save, Download, 
  Plus, Edit, Trash2, Check, X, FileText, Copy,
  Eye, ChevronDown, AlertCircle, Calculator, Settings,
  Printer, CreditCard, RefreshCw, PieChart
} from 'lucide-react';

const GestionTarifsOptimise = () => {
  const [activeTab, setActiveTab] = useState('grille');
  const [filterPro, setFilterPro] = useState('');
  const [filterDossier, setFilterDossier] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'grid'
  
  // Liste complète des types professionnels (mise à jour selon votre formule)
  const proTypes = [
    "PARTICULIER",
    "ARCADIA", 
    "SODERBAT", 
    "ECA", 
    "LT ARTISAN", 
    "COMBLESPACE", 
    "COMBLE DAN FRANCE", 
    "MAISON DES TRAVAUX ANTONY 92", 
    "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91", 
    "MAISON DES TRAVAUX VAL D'YERRES 91", 
    "MAISON DES TRAVAUX COMTE ROBERT 77", 
    "TERRASSE ET JARDIN", 
    "B3C birba", 
    "RENOKEA", 
    "GROUPE APB", 
    "PUREWATT",
    "S.AUGUSTO", 
    "3D TRAVAUX", 
    "BATI PRESTO", 
    "CPHF"
  ];
  
  // Liste des types de dossiers (mise à jour selon votre formule)
  const dossierTypes = [
    "DP",
    "DP+MUR", 
    "PC+RT", 
    "PC+RT+SIGNATURE",
    "PCMODIF+RT", 
    "fenetre", 
    "dossier groupé fenetre + ITE",
    "incompletude",
    "DP ITE",
    "DP piscine", 
    "DP solair", 
    "ERP", 
    "PLAN DE MASSE", 
    "PAC", 
    "Réalisation 3D"
  ];
  
  // Fonction pour obtenir le tarif selon la formule
  const getTarifFromFormula = (pro, typeDossier) => {
    // Implémentation de la logique de votre formule
    switch(typeDossier) {
      case "DP":
        switch(pro) {
          case "PARTICULIER": return { tarif: 350, remise: 0, final: 350 };
          case "ARCADIA": return { tarif: 300, remise: 12, final: 264 };
          case "SODERBAT": return { tarif: 400, remise: 16, final: 336 };
          case "ECA": return { tarif: 300, remise: 17.7, final: 247 };
          case "LT ARTISAN": return { tarif: 400, remise: 16, final: 336 };
          case "COMBLESPACE": return { tarif: 400, remise: 16, final: 336 };
          case "COMBLE DAN FRANCE": return { tarif: 400, remise: 19, final: 324 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 800, remise: 17.5, final: 660 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 800, remise: 17.5, final: 660 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 1600, remise: 16.25, final: 1340 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 800, remise: 17.5, final: 660 };
          case "TERRASSE ET JARDIN": return { tarif: 400, remise: 16, final: 336 };
          case "B3C birba": return { tarif: 150, remise: 16.7, final: 125 };
          case "RENOKEA": return { tarif: 400, remise: 16, final: 336 };
          case "GROUPE APB": return { tarif: 300, remise: 10, final: 270 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 350, remise: 0, final: 350 };
        }
      case "DP+MUR":
        switch(pro) {
          case "PARTICULIER": return { tarif: 650, remise: 0, final: 650 };
          case "ARCADIA": return { tarif: 450, remise: 12, final: 396 };
          case "SODERBAT": return { tarif: 550, remise: 12.7, final: 480 };
          case "ECA": return { tarif: 550, remise: 16.4, final: 460 };
          case "LT ARTISAN": return { tarif: 550, remise: 12.7, final: 480 };
          case "COMBLESPACE": return { tarif: 550, remise: 12.7, final: 480 };
          case "COMBLE DAN FRANCE": return { tarif: 550, remise: 13.8, final: 474 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 950, remise: 15.4, final: 804 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 950, remise: 15.4, final: 804 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 1900, remise: 16.5, final: 1586 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 950, remise: 15.4, final: 804 };
          case "TERRASSE ET JARDIN": return { tarif: 550, remise: 12.7, final: 480 };
          case "B3C birba": return { tarif: 650, remise: 15.4, final: 550 };
          case "RENOKEA": return { tarif: 550, remise: 12.7, final: 480 };
          case "GROUPE APB": return { tarif: 400, remise: 13, final: 348 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 650, remise: 0, final: 650 };
        }
      case "PC+RT":
        switch(pro) {
          case "PARTICULIER": return { tarif: 960, remise: 0, final: 960 };
          case "ARCADIA": return { tarif: 600, remise: 15.3, final: 508 };
          case "SODERBAT": return { tarif: 750, remise: 15.9, final: 631 };
          case "ECA": return { tarif: 750, remise: 15.9, final: 631 };
          case "LT ARTISAN": return { tarif: 750, remise: 15.9, final: 631 };
          case "COMBLESPACE": return { tarif: 750, remise: 15.9, final: 631 };
          case "COMBLE DAN FRANCE": return { tarif: 700, remise: 16.9, final: 582 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 1350, remise: 15.6, final: 1140 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 1350, remise: 15.6, final: 1140 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 2800, remise: 14.3, final: 2400 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 1350, remise: 15.6, final: 1140 };
          case "TERRASSE ET JARDIN": return { tarif: 750, remise: 15.9, final: 631 };
          case "B3C birba": return { tarif: 1000, remise: 15, final: 850 };
          case "RENOKEA": return { tarif: 750, remise: 15.9, final: 631 };
          case "GROUPE APB": return { tarif: 300, remise: 12, final: 264 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 960, remise: 0, final: 960 };
        }
      // Ajout des autres cas selon la formule
      case "PC+RT+SIGNATURE":
        switch(pro) {
          case "PARTICULIER": return { tarif: 2460, remise: 0, final: 2460 };
          case "ARCADIA": return { tarif: 1150, remise: 14.1, final: 988 };
          case "SODERBAT": return { tarif: 1300, remise: 14.5, final: 1111 };
          case "ECA": return { tarif: 1550, remise: 12.8, final: 1351 };
          case "LT ARTISAN": return { tarif: 1200, remise: 12.4, final: 1051 };
          case "COMBLESPACE": return { tarif: 1300, remise: 14.5, final: 1111 };
          case "COMBLE DAN FRANCE": return { tarif: 1350, remise: 13.3, final: 1171 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 2600, remise: 13.1, final: 2260 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 2600, remise: 13.1, final: 2260 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 3200, remise: 12.5, final: 2800 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 2600, remise: 13.1, final: 2260 };
          case "TERRASSE ET JARDIN": return { tarif: 1300, remise: 14.5, final: 1111 };
          case "B3C birba": return { tarif: 1750, remise: 14.3, final: 1500 };
          case "RENOKEA": return { tarif: 1300, remise: 14.5, final: 1111 };
          case "GROUPE APB": return { tarif: 300, remise: 12, final: 264 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 2460, remise: 0, final: 2460 };
        }
      case "PCMODIF+RT":
        switch(pro) {
          case "PARTICULIER": return { tarif: 960, remise: 0, final: 960 };
          case "ARCADIA": return { tarif: 500, remise: 10, final: 450 };
          case "SODERBAT": return { tarif: 500, remise: 10, final: 450 };
          case "ECA": return { tarif: 500, remise: 10, final: 450 };
          case "LT ARTISAN": return { tarif: 500, remise: 10, final: 450 };
          case "COMBLESPACE": return { tarif: 500, remise: 10, final: 450 };
          case "COMBLE DAN FRANCE": return { tarif: 500, remise: 10, final: 450 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 1100, remise: 12.7, final: 960 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 1100, remise: 12.7, final: 960 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 2200, remise: 11.8, final: 1940 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 1100, remise: 12.7, final: 960 };
          case "TERRASSE ET JARDIN": return { tarif: 750, remise: 15.9, final: 631 };
          case "B3C birba": return { tarif: 1000, remise: 15, final: 850 };
          case "RENOKEA": return { tarif: 750, remise: 15.9, final: 631 };
          case "GROUPE APB": return { tarif: 300, remise: 12, final: 264 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 960, remise: 0, final: 960 };
        }
      case "fenetre":
        switch(pro) {
          case "PARTICULIER": return { tarif: 500, remise: 0, final: 500 };
          case "ARCADIA": return { tarif: 350, remise: 14.3, final: 300 };
          case "SODERBAT": return { tarif: 450, remise: 11.1, final: 400 };
          case "ECA": return { tarif: 400, remise: 12.5, final: 350 };
          case "LT ARTISAN": return { tarif: 450, remise: 11.1, final: 400 };
          case "COMBLESPACE": return { tarif: 450, remise: 11.1, final: 400 };
          case "COMBLE DAN FRANCE": return { tarif: 450, remise: 13.3, final: 390 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 850, remise: 11.8, final: 750 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 850, remise: 11.8, final: 750 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 1600, remise: 9.4, final: 1450 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 850, remise: 11.8, final: 750 };
          case "TERRASSE ET JARDIN": return { tarif: 450, remise: 11.1, final: 400 };
          case "B3C birba": return { tarif: 500, remise: 10, final: 450 };
          case "RENOKEA": return { tarif: 450, remise: 11.1, final: 400 };
          case "GROUPE APB": return { tarif: 300, remise: 10, final: 270 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 500, remise: 0, final: 500 };
        }
      case "dossier groupé fenetre + ITE":
        switch(pro) {
          case "PARTICULIER": return { tarif: 600, remise: 0, final: 600 };
          case "ARCADIA": return { tarif: 400, remise: 12.5, final: 350 };
          case "SODERBAT": return { tarif: 550, remise: 9.1, final: 500 };
          case "ECA": return { tarif: 500, remise: 10, final: 450 };
          case "LT ARTISAN": return { tarif: 550, remise: 9.1, final: 500 };
          case "COMBLESPACE": return { tarif: 550, remise: 9.1, final: 500 };
          case "COMBLE DAN FRANCE": return { tarif: 550, remise: 12.7, final: 480 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 950, remise: 10.5, final: 850 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 950, remise: 10.5, final: 850 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 1800, remise: 8.3, final: 1650 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 950, remise: 10.5, final: 850 };
          case "TERRASSE ET JARDIN": return { tarif: 550, remise: 9.1, final: 500 };
          case "B3C birba": return { tarif: 600, remise: 8.3, final: 550 };
          case "RENOKEA": return { tarif: 550, remise: 9.1, final: 500 };
          case "GROUPE APB": return { tarif: 400, remise: 13, final: 348 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 600, remise: 0, final: 600 };
        }
      case "incompletude":
        switch(pro) {
          case "PARTICULIER": return { tarif: 600, remise: 0, final: 600 };
          case "ARCADIA": return { tarif: 400, remise: 12.5, final: 350 };
          case "SODERBAT": return { tarif: 550, remise: 9.1, final: 500 };
          case "ECA": return { tarif: 500, remise: 10, final: 450 };
          case "LT ARTISAN": return { tarif: 550, remise: 9.1, final: 500 };
          case "COMBLESPACE": return { tarif: 550, remise: 9.1, final: 500 };
          case "COMBLE DAN FRANCE": return { tarif: 550, remise: 12.7, final: 480 };
          case "MAISON DES TRAVAUX ANTONY 92": return { tarif: 950, remise: 10.5, final: 850 };
          case "MAISON DES TRAVAUX SAINTE-GENEVIEVE 91": return { tarif: 950, remise: 10.5, final: 850 };
          case "MAISON DES TRAVAUX VAL D'YERRES 91": return { tarif: 1800, remise: 8.3, final: 1650 };
          case "MAISON DES TRAVAUX COMTE ROBERT 77": return { tarif: 950, remise: 10.5, final: 850 };
          case "TERRASSE ET JARDIN": return { tarif: 550, remise: 9.1, final: 500 };
          case "B3C birba": return { tarif: 600, remise: 8.3, final: 550 };
          case "RENOKEA": return { tarif: 550, remise: 9.1, final: 500 };
          case "GROUPE APB": return { tarif: 200, remise: 10.6, final: 178.8 };
          case "PUREWATT": return { tarif: 300, remise: 8.3, final: 275 };
          default: return { tarif: 600, remise: 0, final: 600 };
        }
      // Autres types de dossiers par défaut
      default:
        return { tarif: 500, remise: 0, final: 500 };
    }
  };
  
  // Générer les données de la grille tarifaire à partir de la formule
  const generateGrilleData = () => {
    let data = [];
    
    // Pour chaque professionnel et type de dossier, calculer le tarif
    proTypes.forEach(pro => {
      dossierTypes.forEach(type => {
        // Ne générer que les combinaisons qui existent dans la formule
        if (type === "DP" || type === "DP+MUR" || type === "PC+RT" || 
            type === "PC+RT+SIGNATURE" || type === "PCMODIF+RT" || 
            type === "fenetre" || type === "dossier groupé fenetre + ITE" || 
            type === "incompletude") {
          const tarifInfo = getTarifFromFormula(pro, type);
          data.push({
            pro: pro,
            type: type,
            tarif: tarifInfo.tarif,
            remise: tarifInfo.remise,
            final: tarifInfo.final
          });
        }
      });
    });
    
    return data;
  };
  
  // État pour les données de la grille tarifaire
  const [grilleData, setGrilleData] = useState(generateGrilleData());
  
  // Filtrer les données selon les filtres
  const filteredGrille = grilleData.filter(item => {
    return (
      (filterPro ? item.pro === filterPro : true) &&
      (filterDossier ? item.type === filterDossier : true)
    );
  });
  
  // Analyser les tarifs pour le client Pro sélectionné
  const analyzeProTarifs = (pro) => {
    if (!pro) return null;
    
    const proData = grilleData.filter(item => item.pro === pro);
    const avgRemise = proData.reduce((acc, curr) => acc + curr.remise, 0) / proData.length;
    const maxTarif = Math.max(...proData.map(item => item.tarif));
    const minTarif = Math.min(...proData.map(item => item.tarif));
    
    return {
      total: proData.length,
      avgRemise: avgRemise.toFixed(2),
      maxTarif,
      minTarif
    };
  };
  
  // Calculer les statistiques globales
  const calculateStats = () => {
    const totalTarifs = grilleData.length;
    const avgTarifBase = grilleData.reduce((acc, curr) => acc + curr.tarif, 0) / totalTarifs;
    const avgRemise = grilleData.reduce((acc, curr) => acc + curr.remise, 0) / totalTarifs;
    const avgFinal = grilleData.reduce((acc, curr) => acc + curr.final, 0) / totalTarifs;
    
    return {
      totalTarifs,
      avgTarifBase: avgTarifBase.toFixed(2),
      avgRemise: avgRemise.toFixed(2),
      avgFinal: avgFinal.toFixed(2)
    };
  };
  
  const stats = calculateStats();
  const selectedProStats = analyzeProTarifs(filterPro);
  
  // Simuler la mise à jour d'une cellule
  const handleCellUpdate = (pro, type, field, value) => {
    const updatedGrille = grilleData.map(item => {
      if (item.pro === pro && item.type === type) {
        let updatedItem = { ...item };
        updatedItem[field] = parseFloat(value);
        
        // Recalculer le prix final si nécessaire
        if (field === 'tarif' || field === 'remise') {
          updatedItem.final = updatedItem.tarif * (1 - updatedItem.remise / 100);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setGrilleData(updatedGrille);
    setEditingCell(null);
    
    // Afficher toast de confirmation
    setToastMessage('Tarif mis à jour avec succès');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Démarrer l'édition d'une cellule
  const startEditing = (pro, type, field) => {
    setEditingCell({ pro, type, field });
  };
  
  // Annuler l'édition
  const cancelEditing = () => {
    setEditingCell(null);
  };
  
  // Composant pour cellule éditable
  const EditableCell = ({ pro, type, field, value, currency = false }) => {
    const isEditing = editingCell && 
                     editingCell.pro === pro && 
                     editingCell.type === type && 
                     editingCell.field === field;
    
    const [tempValue, setTempValue] = useState(value);
    
    if (isEditing) {
      return (
        <div className="flex items-center">
          <input 
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-20 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            step={field === 'remise' ? '0.1' : '1'}
          />
          <div className="flex ml-1">
            <button 
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              onClick={() => handleCellUpdate(pro, type, field, tempValue)}
            >
              <Check size={16} />
            </button>
            <button 
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              onClick={cancelEditing}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className="group cursor-pointer"
        onClick={() => startEditing(pro, type, field)}
      >
        <div className="flex items-center">
          <span>{currency ? `${value.toFixed(2)} €` : value}</span>
          <Edit size={14} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </div>
    );
  };
  
  // Composant de carte pour la vue en grille
  const TarifCard = ({ item }) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.pro}</h3>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
              {item.type}
            </span>
          </div>
          <div className="flex space-x-1">
            <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50">
              <Copy size={16} />
            </button>
            <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Tarif de base:</span>
            <span className="font-medium">{item.tarif.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Remise:</span>
            <span className="font-medium">{item.remise.toFixed(2)} %</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-600">Prix final:</span>
            <span className="text-lg font-semibold text-green-600">{item.final.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gestion des tarifs - DTAHC</h1>
          <p className="text-gray-500">Configuration des grilles tarifaires pour les professionnels et types de dossiers</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm flex items-center gap-2 hover:bg-gray-50">
            <Settings size={16} />
            <span>Configuration</span>
          </button>
          <button className="px-3 py-2 bg-blue-600 rounded-md text-white text-sm flex items-center gap-2 hover:bg-blue-700">
            <Save size={16} />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
      
      {/* Bannière d'information */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <AlertCircle size={18} />
        </div>
        <div>
          <p className="text-blue-800 text-sm font-medium mb-1">
            Nouvelle gestion des tarifs optimisée
          </p>
          <p className="text-blue-700 text-sm">
            Cette interface vous permet de gérer vos grilles tarifaires pour tous vos professionnels et types de dossiers.
            Les tarifs sont calculés automatiquement selon la formule définie dans votre système actuel.
            Utilisez les filtres pour afficher les tarifs spécifiques à un professionnel ou un type de dossier.
          </p>
        </div>
      </div>
      
      {/* La section "Tableau de bord résumé" a été supprimée comme demandé */}
      
      {/* Filtres et actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 w-48 md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white w-48"
              value={filterPro}
              onChange={(e) => setFilterPro(e.target.value)}
            >
              <option value="">Tous les professionnels</option>
              {proTypes.map((pro, index) => (
                <option key={index} value={pro}>{pro}</option>
              ))}
            </select>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white w-48"
              value={filterDossier}
              onChange={(e) => setFilterDossier(e.target.value)}
            >
              <option value="">Tous les types de dossier</option>
              {dossierTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('table')}
              >
                <FileText size={16} />
                <span>Tableau</span>
              </button>
              <button 
                className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('grid')}
              >
                <div className="grid grid-cols-2 gap-0.5" style={{ width: '16px', height: '16px' }}>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                <span>Grille</span>
              </button>
            </div>
            
            <button className="px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm flex items-center gap-2 hover:bg-gray-50">
              <Download size={16} />
              <span>Exporter</span>
            </button>
            <button className="px-3 py-2 bg-green-600 rounded-md text-white text-sm flex items-center gap-2 hover:bg-green-700">
              <Plus size={16} />
              <span>Nouveau tarif</span>
            </button>
          </div>
        </div>
        
        {/* Statistiques du pro sélectionné */}
        {filterPro && selectedProStats && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Statistiques pour {filterPro}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-500">Total tarifs</p>
                <p className="text-lg font-medium">{selectedProStats.total}</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-500">Remise moyenne</p>
                <p className="text-lg font-medium">{selectedProStats.avgRemise} %</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-500">Tarif le plus élevé</p>
                <p className="text-lg font-medium">{selectedProStats.maxTarif} €</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-500">Tarif le plus bas</p>
                <p className="text-lg font-medium">{selectedProStats.minTarif} €</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Vue tableau */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type de dossier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarif de base (€)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remise (%)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix final (€)
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrille.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.pro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell 
                        pro={item.pro} 
                        type={item.type} 
                        field="tarif" 
                        value={item.tarif} 
                        currency={true} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell 
                        pro={item.pro} 
                        type={item.type} 
                        field="remise" 
                        value={item.remise} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.final.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Copy size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 size={16} />
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
      
      {/* Vue grille */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {filteredGrille.map((item, index) => (
            <TarifCard key={index} item={item} />
          ))}
        </div>
      )}
      
      {/* Résumé et actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Historique des modifications récentes</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pro</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">17/05/2025</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">ARCADIA</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Modification remise DP+MUR</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">David</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">16/05/2025</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">B3C birba</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Ajout tarif PC+RT</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">David</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">15/05/2025</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">PUREWATT</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Mise à jour tarifs</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">Sophie</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <span>Voir l'historique complet</span>
            <ChevronDown size={14} className="ml-1" />
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left flex items-center gap-3 transition-colors">
              <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Mettre à jour tous les tarifs</p>
                <p className="text-xs text-gray-500">Appliquer une modification globale</p>
              </div>
            </button>
            
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left flex items-center gap-3 transition-colors">
              <div className="p-2 bg-green-100 rounded-md text-green-700">
                <Download size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Exporter en Excel</p>
                <p className="text-xs text-gray-500">Télécharger la grille complète</p>
              </div>
            </button>
            
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left flex items-center gap-3 transition-colors">
              <div className="p-2 bg-purple-100 rounded-md text-purple-700">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Générer un devis</p>
                <p className="text-xs text-gray-500">Créer un nouveau devis client</p>
              </div>
            </button>
            
            <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left flex items-center gap-3 transition-colors">
              <div className="p-2 bg-indigo-100 rounded-md text-indigo-700">
                <Settings size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Paramètres avancés</p>
                <p className="text-xs text-gray-500">Configurer la gestion des tarifs</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast de notification */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 ${toastType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border shadow-lg rounded-lg p-4 flex items-center gap-3 animate-fade-in z-50`}>
          {toastType === 'success' ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <AlertCircle size={20} className="text-red-500" />
          )}
          <p className={`${toastType === 'success' ? 'text-green-800' : 'text-red-800'} font-medium`}>
            {toastMessage}
          </p>
          <button 
            className="ml-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowToast(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GestionTarifsOptimise;