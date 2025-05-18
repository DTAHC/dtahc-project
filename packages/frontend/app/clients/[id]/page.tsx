'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Client, Dossier } from '@dtahc/shared';
import { DossierCard } from '@/components/dossiers/DossierCard';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Récupérer les informations du client
        const clientResponse = await fetch(`/api/clients/${id}`);
        
        if (!clientResponse.ok) {
          throw new Error('Erreur lors de la récupération du client');
        }
        
        const clientData = await clientResponse.json();
        setClient(clientData);
        
        // Récupérer les dossiers du client
        const dossiersResponse = await fetch(`/api/dossiers/client/${id}`);
        
        if (!dossiersResponse.ok) {
          throw new Error('Erreur lors de la récupération des dossiers');
        }
        
        const dossiersData = await dossiersResponse.json();
        setDossiers(dossiersData);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Client non trouvé.</p>
          <Link 
            href="/clients" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Retour à la liste des clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              href="/clients" 
              className="text-blue-600 hover:text-blue-800"
            >
              Clients
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold">
              {client.contactInfo?.firstName} {client.contactInfo?.lastName}
            </h1>
          </div>
          <p className="text-gray-600">{client.reference}</p>
        </div>
        
        <Link 
          href={`/dossiers/new?clientId=${client.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Nouveau dossier
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations du client</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-medium">{client.contactInfo?.firstName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{client.contactInfo?.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.contactInfo?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{client.contactInfo?.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Type de client</p>
                <p className="font-medium">{client.clientType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date de création</p>
                <p className="font-medium">
                  {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            
            {client.addresses && client.addresses.length > 0 ? (
              <>
                <p className="text-sm">
                  {client.addresses[0].street}
                </p>
                <p className="text-sm">
                  {client.addresses[0].postalCode} {client.addresses[0].city}
                </p>
                <p className="text-sm">
                  {client.addresses[0].country}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Aucune adresse renseignée</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Dossiers</h2>
        
        {dossiers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Aucun dossier trouvé pour ce client.</p>
            <Link 
              href={`/dossiers/new?clientId=${client.id}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Créer un nouveau dossier
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dossiers.map((dossier) => (
              <DossierCard key={dossier.id} dossier={dossier} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}