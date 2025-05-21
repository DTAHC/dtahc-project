'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function FicheProjetPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Rediriger vers la page d'accueil après un court délai
    const timeout = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
        <div className="p-6 bg-yellow-50 border-b border-yellow-100">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès invalide</h1>
        </div>
        
        <div className="p-6">
          <p className="mb-6 text-gray-600">
            Cette page n'est pas accessible directement.
            Vous allez être redirigé vers la page d'accueil dans quelques secondes.
          </p>
          
          <div className="mt-4">
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}