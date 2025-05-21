'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Client, ClientType } from '@dtahc/shared';
import { ArrowLeft, CheckCircle, User, Building, AtSign, Phone, Map, Save } from 'lucide-react';

export default function ClientEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // État pour les données du client
  const [clientData, setClientData] = useState<Partial<Client>>({
    clientType: ClientType.PARTICULIER,
    status: 'ACTIF',
    // Nous utilisons Partial<Client> donc le compilateur ne devrait pas s'attendre
    // à ce que contactInfo soit complet
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    } as any, // Utiliser un cast pour éviter les erreurs de typage pendant l'initialisation
    addresses: [{
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      type: 'PRINCIPALE',
    } as any], // Cast similaire ici
  });
  
  // Charger les données du client
  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      try {
        const { getClientById } = await import('@/lib/api/clients');
        const response = await getClientById(id as string);
        
        if (response && response.data) {
          // S'assurer que tous les champs nécessaires sont disponibles
          const client = response.data;
          
          setClientData({
            ...client,
            contactInfo: client.contactInfo || {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
            },
            addresses: client.addresses && client.addresses.length > 0 
              ? client.addresses 
              : [{
                  street: '',
                  city: '',
                  postalCode: '',
                  country: 'France',
                  type: 'PRINCIPALE',
                }],
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du client:', error);
        setErrorMessage('Impossible de charger les informations du client.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchClient();
    }
  }, [id]);
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Traiter les champs imbriqués (contactInfo, addresses)
    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setClientData(prev => {
        const updated = {
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [field]: value,
          },
        };
        // Utiliser un cast pour éviter les erreurs de typage strictes
        return updated as Partial<Client>;
      });
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      const addresses = [...(clientData.addresses || [])];
      if (addresses.length === 0) {
        addresses.push({
          street: '',
          city: '',
          postalCode: '',
          country: 'France',
          type: 'PRINCIPALE',
        } as any);
      }
      addresses[0] = { ...addresses[0], [field]: value };
      setClientData(prev => {
        const updated = {
          ...prev,
          addresses,
        };
        // Utiliser un cast pour éviter les erreurs de typage strictes
        return updated as Partial<Client>;
      });
    } else {
      setClientData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setHasChanges(true);
  };
  
  // Envoyer le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      return;
    }
    
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      const { updateClient } = await import('@/lib/api/clients');
      await updateClient(id as string, clientData);
      
      setSuccessMessage('Client mis à jour avec succès !');
      setHasChanges(false);
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrorMessage('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href={`/clients/${id}`} 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" />
            Retour au client
          </Link>
          <h1 className="text-2xl font-bold">Modifier le client</h1>
        </div>
      </div>
      
      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle size={18} className="mr-2" />
            <span>{successMessage}</span>
          </div>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-green-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="text-red-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          {/* Informations générales */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de client
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {clientData.clientType === ClientType.PARTICULIER ? (
                      <User size={18} className="text-gray-500" />
                    ) : (
                      <Building size={18} className="text-gray-500" />
                    )}
                  </div>
                  <select
                    name="clientType"
                    value={clientData.clientType}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={ClientType.PARTICULIER}>Particulier</option>
                    <option value={ClientType.COMBLE_DF}>Comble DF</option>
                    <option value={ClientType.MDT_ANTONY}>MDT Antony</option>
                    <option value={ClientType.RENOKEA}>Renokea</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  value={clientData.status}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ACTIF">Actif</option>
                  <option value="PROSPECT">Prospect</option>
                  <option value="INACTIF">Inactif</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Informations de contact */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  name="contactInfo.firstName"
                  value={clientData.contactInfo?.firstName || ''}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="contactInfo.lastName"
                  value={clientData.contactInfo?.lastName || ''}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={clientData.contactInfo?.email || ''}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="contactInfo.phone"
                    value={clientData.contactInfo?.phone || ''}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Adresse */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rue
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Map size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="address.street"
                    value={clientData.addresses?.[0]?.street || ''}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={clientData.addresses?.[0]?.postalCode || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={clientData.addresses?.[0]?.city || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-between items-center">
          <Link
            href={`/clients/${id}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Annuler
          </Link>
          
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`flex items-center px-5 py-2 rounded-md text-white ${
              isSaving || !hasChanges ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}