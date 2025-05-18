import React from 'react';
import { useForm } from 'react-hook-form';
import { ClientType, CreateClientDto } from '@dtahc/shared';

interface ClientFormProps {
  onSubmit: (data: CreateClientDto) => void;
  initialData?: Partial<CreateClientDto>;
  isSubmitting?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isSubmitting = false 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateClientDto>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Informations du client</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de client
            </label>
            <select
              {...register('clientType', { required: 'Le type de client est requis' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ClientType.PARTICULIER}>Particulier</option>
              <option value={ClientType.ARCADIA}>Arcadia</option>
              <option value={ClientType.COMBLE_DF}>Comble DF</option>
              <option value={ClientType.MDT_ANTONY}>MDT Antony</option>
              <option value={ClientType.ECA}>ECA</option>
              <option value={ClientType.LT_ARTISAN}>LT Artisan</option>
              <option value={ClientType.SODERBAT}>Soderbat</option>
              <option value={ClientType.COMBLESPACE}>Comblespace</option>
              <option value={ClientType.B3C}>B3C</option>
              <option value={ClientType.RENOKEA}>Renokea</option>
              {/* Ajoutez d'autres options selon les besoins */}
            </select>
            {errors.clientType && (
              <p className="text-red-500 text-xs mt-1">{errors.clientType.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Coordonnées</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              {...register('firstName', { 
                required: 'Le prénom est requis',
                minLength: { value: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              {...register('lastName', { 
                required: 'Le nom est requis',
                minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'L\'email est requis',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'Le téléphone est requis',
                minLength: { value: 10, message: 'Le téléphone doit contenir au moins 10 caractères' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Adresse</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rue
            </label>
            <input
              type="text"
              {...register('street', { required: 'L\'adresse est requise' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              {...register('city', { required: 'La ville est requise' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code postal
            </label>
            <input
              type="text"
              {...register('postalCode', { required: 'Le code postal est requis' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};