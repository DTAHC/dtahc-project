'use client';

import { useState, useEffect, useCallback } from 'react';
import { notifyDossierUpdate, subscribeToDossierUpdates } from '../utils/dossierEvents';

/**
 * Hook personnalisé pour gérer les dossiers
 * Cette approche centralise la logique d'accès aux dossiers et évite les problèmes d'hydratation
 */
export function useDossiers() {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fonction pour récupérer les dossiers
  const fetchDossiers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Appel à l'API avec en-têtes anti-cache
      const response = await fetch('/api/dossiers', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des dossiers: ${response.status}`);
      }
      
      const data = await response.json();
      setDossiers(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des dossiers:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour récupérer les dossiers d'un client spécifique
  const fetchClientDossiers = useCallback(async (clientId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Appel à l'API avec en-têtes anti-cache
      const response = await fetch(`/api/clients/${clientId}/dossiers`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des dossiers du client: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Erreur lors de la récupération des dossiers du client ${clientId}:`, err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour créer un nouveau dossier
  const createDossier = useCallback(async (dossierData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dossiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(dossierData)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la création du dossier: ${response.status}`);
      }
      
      const newDossier = await response.json();
      
      // Mettre à jour l'état local
      setDossiers(prevDossiers => [newDossier, ...prevDossiers]);
      
      // Notifier les autres composants
      notifyDossierUpdate();
      
      return newDossier;
    } catch (err) {
      console.error('Erreur lors de la création du dossier:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Forcer un rafraîchissement des données
  const refreshDossiers = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Effet pour charger les dossiers au montage et lors des rafraîchissements
  useEffect(() => {
    // Ne s'exécute que côté client
    if (typeof window === 'undefined') return;
    
    fetchDossiers();
  }, [fetchDossiers, refreshKey]);

  // S'abonner aux mises à jour des dossiers
  useEffect(() => {
    // Ne s'exécute que côté client
    if (typeof window === 'undefined') return;
    
    // S'abonner aux mises à jour
    const unsubscribe = subscribeToDossierUpdates(() => {
      console.log('Hook useDossiers: Rafraîchissement des dossiers suite à une mise à jour');
      refreshDossiers();
    });
    
    // Se désabonner lors du démontage
    return unsubscribe;
  }, [refreshDossiers]);

  return {
    dossiers,
    loading,
    error,
    fetchDossiers,
    fetchClientDossiers,
    createDossier,
    refreshDossiers
  };
}