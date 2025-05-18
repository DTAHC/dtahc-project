import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  DossierType, 
  Priority, 
  CreateDossierDto,
  Client 
} from '@dtahc/shared';

interface DossierFormProps {
  onSubmit: (data: CreateDossierDto) => void;
  initialData?: Partial<CreateDossierDto>;
  isSubmitting?: boolean;
  clients?: Client[];
  selectedClientId?: string;
}

export const DossierForm: React.FC<DossierFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isSubmitting = false,
  clients = [],
  selectedClientId 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateDossierDto>({
    defaultValues: {
      ...initialData,
      clientId: selectedClientId || initialData.clientId
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Informations du dossier</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du dossier
            </label>
            <input
              type="text"
              {...register('title', { 
                required: 'Le titre est requis',
                minLength: { value: 3, message: 'Le titre doit contenir au moins 3 caractères' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {!selectedClientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                {...register('clientId', { required: 'Le client est requis' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.contactInfo?.firstName} {client.contactInfo?.lastName} ({client.reference})
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de dossier
            </label>
            <select
              {...register('type', { required: 'Le type de dossier est requis' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={DossierType.DP}>Déclaration Préalable (DP)</option>
              <option value={DossierType.PC}>Permis de Construire (PC)</option>
              <option value={DossierType.PCMI}>Permis de Construire Maison Individuelle (PCMI)</option>
              <option value={DossierType.PA}>Permis d'Aménager (PA)</option>
              <option value={DossierType.AT_ERP}>Autorisation de Travaux ERP (AT-ERP)</option>
              <option value={DossierType.DAACT}>DAACT</option>
              <option value={DossierType.DOE}>DOE</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              {...register('priority')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={Priority.NORMAL}>Normale</option>
              <option value={Priority.FAIBLE}>Faible</option>
              <option value={Priority.URGENT}>Urgente</option>
              <option value={Priority.CRITIQUE}>Critique</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface existante (m²)
            </label>
            <input
              type="number"
              {...register('surfaceExistant', { 
                valueAsNumber: true,
                min: { value: 0, message: 'La surface doit être positive' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.surfaceExistant && (
              <p className="text-red-500 text-xs mt-1">{errors.surfaceExistant.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface projet (m²)
            </label>
            <input
              type="number"
              {...register('surfaceProjet', { 
                valueAsNumber: true,
                min: { value: 0, message: 'La surface doit être positive' }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.surfaceProjet && (
              <p className="text-red-500 text-xs mt-1">{errors.surfaceProjet.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              {...register('deadline')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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