'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type AuthWrapperProps = {
  children: ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // En mode développement, considérer l'utilisateur comme toujours authentifié
    // En production, vérifiez le localStorage ou un cookie JWT
    const isAuthenticated = true; // localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}