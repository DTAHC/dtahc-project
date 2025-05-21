'use client';

import dynamic from 'next/dynamic';

// Charger le composant de confirmation côté client uniquement pour éviter les erreurs d'hydratation
const ConfirmationPage = dynamic(() => import('@/components/forms/ConfirmationPage'), {
  ssr: false, // Désactiver le rendu côté serveur
  loading: () => (
    <div className="container mx-auto p-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement de la confirmation...</p>
    </div>
  ),
});

export default function ConfirmationPageWrapper() {
  return <ConfirmationPage />;
}