'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Building, Calendar, 
  DollarSign, Send, Save, ArrowRight, X, Check, 
  FilePlus, Clipboard, AlertCircle, Info
} from 'lucide-react';

// Adapter avec vos API réelles
import { createClient, sendClientFormLink } from '@/lib/api/clients';
import { emailsApi } from '@/lib/api/emails';

const CreationFicheClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  
  const [clientType, setClientType] = useState('particulier');
  const [sendLink, setSendLink] = useState(false);
  const [pricingMethod, setPricingMethod] = useState('manual');
  
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientType: 'particulier',
    professionalType: '',
    companyName: '',
    dossierType: '',
    price: '',
    creationDate: new Date().toISOString().split('T')[0],
    message: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Liste complète des clients professionnels
  const professionalTypes = [
    "ARCADIA", "COMBLE DF", "ECA", "LT ARTISANS", "ODERBAT", 
    "COMBLESPACE", "PARTICULIER", "MDT ANTONY", "MDT C.ROBERT", 
    "MDT YERRES", "MDT ST-GEN", "B3C", "TERRASSE ET JAR", 
    "RENOK", "EA", "GROUPE APB", "PUREWATT", "S.AUGUSTO", 
    "3D TRAVAUX", "BATI PRESTO", "CPH", "FM", "MDT FONT"
  ];
  
  // Liste complète des types de dossiers
  const dossierTypes = [
    "DP (Déclaration Préalable)", "DP+MUR", "DP ITE", "DP FENETRE", 
    "DP piscine", "DP solair", "PC+RT", "PC+RT+SIGNATURE", 
    "PC MODIF", "ERP", "FENETRE + ITE", "PLAN DE MASSE", 
    "PAC", "Réalisation 3D"
  ];

  // Création du client et redirection vers la fiche projet manuelle
  const handleManualFill = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Construire le nom complet pour un client particulier
      const fullName = clientType === 'particulier' 
        ? formData.name 
        : `${formData.companyName}`;
      
      // Préparer les données
      const clientData = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        clientType: clientType === 'particulier' ? 'PARTICULIER' : formData.professionalType,
        companyName: formData.companyName,
        professionalType: formData.professionalType,
        city: '', // À compléter si disponible
        postalCode: '', // À compléter si disponible
        dossierType: formData.dossierType,
        price: formData.price,
        creationDate: formData.creationDate,
        fillMethod: 'manual'
      };
      
      const response = await createClient(clientData);
      console.log('Client créé:', response.data);
      
      // Extraire l'ID du client créé
      const clientId = response.data.id;
      
      // Notifier que les clients ont été mis à jour
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clientStorageUpdated'));
        
        // Stocker l'ID pour éviter des problèmes de synchronisation
        try {
          const activeClients = JSON.parse(localStorage.getItem('dtahc_active_clients') || '[]');
          activeClients.push(clientId);
          localStorage.setItem('dtahc_active_clients', JSON.stringify(activeClients));
        } catch (e) {
          console.error('Erreur lors de la sauvegarde de l\'ID client actif:', e);
        }
      }
      
      // Rediriger directement vers la fiche projet du client nouvellement créé
      if (clientId) {
        router.push(`/clients/${clientId}/fiche-projet`);
        toast.success('Client créé avec succès. Complétez sa fiche projet.');
      } else {
        // Fallback vers la liste des clients
        router.push('/clients');
        toast.success('Client créé avec succès.');
      }
    } catch (error) {
      toast.error('Erreur lors de la création du client');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prévisualiser l'email avant envoi
  const handlePreviewEmail = async (): Promise<void> => {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') {
      console.warn('Tentative de prévisualisation côté serveur, ignoré');
      return;
    }
    
    if (!formData.message) {
      toast.error("Veuillez saisir un message pour la prévisualisation");
      return;
    }
    
    try {
      const variables = {
        NOM_CLIENT: formData.name || 'Client',
        EMAIL_CLIENT: formData.email || 'email@exemple.com',
        TYPE_DOSSIER: formData.dossierType || 'Non spécifié'
      };
      
      // Appel direct à l'API sans passer par le service
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/emails/public/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: formData.message, variables }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const preview = data.preview;
      setPreviewHtml(preview);
      setShowPreview(true);
      
      // Afficher la prévisualisation directement sur la page
      const previewContainer = document.createElement('div');
      previewContainer.innerHTML = preview;
      previewContainer.style.position = 'fixed';
      previewContainer.style.top = '50%';
      previewContainer.style.left = '50%';
      previewContainer.style.transform = 'translate(-50%, -50%)';
      previewContainer.style.backgroundColor = 'white';
      previewContainer.style.padding = '20px';
      previewContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      previewContainer.style.zIndex = '9999';
      previewContainer.style.maxWidth = '90%';
      previewContainer.style.maxHeight = '90%';
      previewContainer.style.overflow = 'auto';
      
      // Ajouter un bouton de fermeture
      const closeButton = document.createElement('button');
      closeButton.innerText = 'Fermer';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.padding = '5px 10px';
      closeButton.onclick = () => document.body.removeChild(previewContainer);
      previewContainer.appendChild(closeButton);
      
      document.body.appendChild(previewContainer);
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
      toast.error("Erreur lors de la génération de l'aperçu");
    }
  };

  // Création du client et envoi du lien par email
  const handleSendLink = async (): Promise<void> => {
    setIsSending(true);
    
    try {
      // Construire le nom complet pour un client particulier
      const fullName = clientType === 'particulier' 
        ? formData.name 
        : `${formData.companyName}`;
      
      // Préparer les données
      const clientData = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        clientType: clientType === 'particulier' ? 'PARTICULIER' : formData.professionalType,
        companyName: formData.companyName,
        professionalType: formData.professionalType,
        city: '', // À compléter si disponible
        postalCode: '', // À compléter si disponible
        dossierType: formData.dossierType,
        price: formData.price,
        creationDate: formData.creationDate,
        fillMethod: 'email'
      };
      
      // Création du client avec option d'envoi de lien
      const response = await createClient(clientData);
      console.log('Client créé avec lien:', response.data);
      
      // Si besoin d'un message personnalisé, on peut utiliser sendClientFormLink
      if (formData.message) {
        await sendClientFormLink(response.data.id, formData.message);
      }
      
      // Notifier que les clients ont été mis à jour
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clientStorageUpdated'));
      }
      
      router.push('/clients');
      toast.success('Client créé. Un lien a été envoyé par email.');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du lien');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  // Créer le client avec l'option sélectionnée
  const handleCreateClient = () => {
    if (sendLink) {
      handleSendLink();
    } else {
      handleManualFill();
    }
  };
  
  return (
    <div className="w-full bg-gray-50 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Création de fiche client</h1>
          <p className="text-gray-500 text-sm">Ajoutez un nouveau client et créez sa fiche initiale</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/clients')} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            onClick={handleCreateClient}
            disabled={isLoading || isSending}
            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            Enregistrer
          </button>
        </div>
      </div>
      
      {/* Alerte information */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <Info size={18} />
        </div>
        <div>
          <p className="text-blue-800 text-sm">
            Les informations de base permettent de créer la fiche client initiale. Vous pourrez compléter les informations détaillées ultérieurement ou envoyer un lien au client pour qu'il complète lui-même sa fiche.
          </p>
        </div>
      </div>
      
      {/* Formulaire principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Informations de base</h2>
            
            {/* Type de client */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="particulier"
                    checked={clientType === 'particulier'}
                    onChange={() => setClientType('particulier')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Particulier</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="professionnel"
                    checked={clientType === 'professionnel'}
                    onChange={() => setClientType('professionnel')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Professionnel</span>
                </label>
              </div>
            </div>
            
            {clientType === 'particulier' ? (
              <>
                {/* Nom et prénom pour particulier */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom et prénom</label>
                  <div className="flex items-center relative">
                    <User size={16} className="absolute left-3 text-gray-400" />
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dupont Jean"
                      className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Liste des pros et raison sociale pour pro */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type professionnel</label>
                  <select 
                    name="professionalType"
                    value={formData.professionalType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un type de pro</option>
                    {professionalTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Sélectionnez directement pour les clients récurrents</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale</label>
                  <div className="flex items-center relative">
                    <Building size={16} className="absolute left-3 text-gray-400" />
                    <input 
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Entreprise ABC"
                      className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Contact */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center relative">
                <Mail size={16} className="absolute left-3 text-gray-400" />
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="flex items-center relative">
                <Phone size={16} className="absolute left-3 text-gray-400" />
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <div className="flex items-center relative">
                <MapPin size={16} className="absolute left-3 text-gray-400" />
                <input 
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Rue Principale, 75001 Paris"
                  className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Tarification</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de dossier</label>
              <select 
                name="dossierType"
                value={formData.dossierType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                {dossierTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Méthode de tarification */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de tarification</label>
              <div className="flex space-x-4 mb-2">
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
              </div>
              
              {pricingMethod === 'grid' ? (
                <div className="mb-1">
                  <select 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un tarif</option>
                    <option value="950">Tarif standard - 950€</option>
                    <option value="750">Tarif réduit - 750€</option>
                    <option value="1200">Tarif premium - 1200€</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center relative mb-1">
                  <DollarSign size={16} className="absolute left-3 text-gray-400" />
                  <input 
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="950.00"
                    className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">Tarif HT en euros</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
              <div className="flex items-center relative">
                <Calendar size={16} className="absolute left-3 text-gray-400" />
                <input 
                  type="date"
                  name="creationDate"
                  value={formData.creationDate}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Envoi de lien */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Complétion de la fiche</h2>
        
        <div className="flex flex-col gap-4">
          <div 
            className="flex items-start p-4 border rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => setSendLink(false)}
          >
            <div className="mr-4">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${!sendLink ? 'bg-blue-500 border-2 border-blue-300' : 'border-2 border-gray-300'}`}>
                {!sendLink && <Check size={12} className="text-white" />}
              </div>
            </div>
            <div>
              <h3 className={`text-base font-medium ${!sendLink ? 'text-blue-700' : 'text-gray-700'}`}>Remplir la fiche manuellement</h3>
              <p className="text-sm text-gray-500 mt-1">Vous remplirez vous-même les informations complètes du client directement dans le système.</p>
            </div>
          </div>
          
          <div 
            className="flex items-start p-4 border rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => setSendLink(true)}
          >
            <div className="mr-4">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${sendLink ? 'bg-blue-500 border-2 border-blue-300' : 'border-2 border-gray-300'}`}>
                {sendLink && <Check size={12} className="text-white" />}
              </div>
            </div>
            <div>
              <h3 className={`text-base font-medium ${sendLink ? 'text-blue-700' : 'text-gray-700'}`}>Envoyer un lien au client</h3>
              <p className="text-sm text-gray-500 mt-1">Le client recevra un email avec un lien sécurisé pour compléter sa fiche lui-même.</p>
            </div>
          </div>
          
          {sendLink && (
            <div className="mt-2 p-4 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-blue-800">Configuration de l'envoi du lien</h4>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Lien valide 7 jours</span>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-blue-800 mb-1">Message personnalisé (optionnel)</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Bonjour, merci de remplir votre fiche client en cliquant sur le lien ci-dessous."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-blue-200 focus:ring-blue-500 focus:border-blue-500 bg-white"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handlePreviewEmail}
                  className="px-3 py-1 border border-blue-200 rounded-md text-blue-700 text-sm bg-white hover:bg-blue-50"
                >
                  Prévisualiser
                </button>
                <button 
                  onClick={handleSendLink}
                  disabled={isSending}
                  className="px-3 py-1 bg-blue-600 rounded-md text-white text-sm flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={14} />
                  {isSending ? 'Envoi...' : 'Envoyer maintenant'}
                </button>
              </div>
              <p className="mt-3 text-xs text-blue-700">Les emails sont envoyés à partir de templates pré-remplis automatiquement et incluent un lien sécurisé.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions finales */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.push('/clients')}
          className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <X size={16} />
          Annuler
        </button>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Save size={16} />
            Enregistrer brouillon
          </button>
          <button 
            onClick={handleCreateClient}
            disabled={isLoading || isSending}
            className="px-4 py-2 bg-green-600 rounded-md text-white text-sm font-medium flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
          >
            <Check size={16} />
            {isLoading || isSending ? 'Traitement...' : 'Créer le client'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreationFicheClient;