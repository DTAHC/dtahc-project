'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Charger le composant de formulaire côté client uniquement pour éviter les erreurs d'hydratation
const ProjectForm = dynamic(() => import('@/components/forms/ProjectForm'), {
  ssr: false, // Désactiver le rendu côté serveur
  loading: () => (
    <div className="container mx-auto p-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement du formulaire...</p>
    </div>
  ),
});

export default function ProjectFormPage() {
  const { token } = useParams();
  
  return (
    <ProjectForm token={Array.isArray(token) ? token[0] : token} />
  );
}