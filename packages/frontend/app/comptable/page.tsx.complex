'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import GestionComptable from '@/components/comptabilite/GestionComptable';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ComptablePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérification simplifiée de l'authentification basée sur localStorage
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/auth/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Ne rien rendre pendant la redirection
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion Comptable</h1>
        <GestionComptable />
      </div>
    </DashboardLayout>
  );
}