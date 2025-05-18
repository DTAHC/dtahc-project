import React from 'react';
import Link from 'next/link';
import { Client } from '@dtahc/shared';

interface ClientCardProps {
  client: Client;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Link href={`/clients/${client.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {client.contactInfo?.firstName} {client.contactInfo?.lastName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{client.reference}</p>
            
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Email:</span> {client.contactInfo?.email}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Téléphone:</span> {client.contactInfo?.phone}
            </p>
            
            {client.addresses && client.addresses.length > 0 && (
              <p className="text-sm text-gray-700 mt-2">
                {client.addresses[0].city}, {client.addresses[0].postalCode}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 mb-2">
              {client.clientType}
            </span>
            
            {client.dossiers && (
              <span className="text-xs font-medium text-gray-500">
                {client.dossiers.length} dossier{client.dossiers.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};