'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DossierCard } from '@/components/dossiers/DossierCard';
import { Dossier, DossierStatus, Priority } from '@dtahc/shared';

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  // Ajout d'un état pour forcer le rafraîchissement
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Force un rafraîchissement si on revient à cette page
  useEffect(() => {
    // Écouter l'événement de navigation
    const handleRouteChange = () => {
      setRefreshKey(prevKey => prevKey + 1);
    };
    
    // S'abonner aux événements de navigation
    window.addEventListener('focus', handleRouteChange);
    
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        setIsLoading(true);
        console.log('Chargement des dossiers...');
        
        const response = await fetch('/api/dossiers', {
          // Ajouter un paramètre cache-busting pour éviter la mise en cache
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Ajouter un timestamp pour forcer un nouveau fetch
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des dossiers');
        }
        
        let data = await response.json();
        console.log('Dossiers récupérés:', data);
        
        // Filtrer par statut si nécessaire
        if (statusFilter) {
          data = data.filter((dossier: Dossier) => dossier.status === statusFilter);
        }
        
        // Filtrer par priorité si nécessaire
        if (priorityFilter) {
          data = data.filter((dossier: Dossier) => dossier.priority === priorityFilter);
        }
        
        setDossiers(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossiers();
  }, [statusFilter, priorityFilter, refreshKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dossiers</h1>
          <p className="text-gray-600">Gérez vos dossiers d'autorisation de travaux.</p>
        </div>
        
        <Link 
          href="/dossiers/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Nouveau dossier
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value={DossierStatus.NOUVEAU}>Nouveau</option>
            <option value={DossierStatus.EN_COURS}>En cours</option>
            <option value={DossierStatus.EN_ATTENTE}>En attente</option>
            <option value={DossierStatus.TERMINE}>Terminé</option>
            <option value={DossierStatus.ARCHIVE}>Archivé</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-40 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes</option>
            <option value={Priority.FAIBLE}>Faible</option>
            <option value={Priority.NORMAL}>Normale</option>
            <option value={Priority.URGENT}>Urgente</option>
            <option value={Priority.CRITIQUE}>Critique</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Aucun dossier trouvé.</p>
          <Link 
            href="/dossiers/new" 
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
  );
}