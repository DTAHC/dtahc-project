'use client';

/**
 * Utilitaire pour gérer les événements liés aux dossiers de manière centralisée
 * Cette approche évite les problèmes d'hydratation en séparant clairement
 * le code côté client du code côté serveur
 */

// Événement personnalisé pour le rafraîchissement des dossiers
export const DOSSIER_UPDATED_EVENT = 'dossierStorageUpdated';

/**
 * Émet un événement pour signaler que les dossiers ont été mis à jour
 * À utiliser après les appels réussis aux API de création/modification de dossiers
 */
export function notifyDossierUpdate() {
  // Garantir que ce code ne s'exécute que côté client
  if (typeof window === 'undefined') return;
  
  try {
    const event = new CustomEvent(DOSSIER_UPDATED_EVENT);
    window.dispatchEvent(event);
    console.log('Événement de mise à jour dossier émis');
  } catch (e) {
    console.error('Erreur lors de l\'émission de l\'événement de mise à jour:', e);
  }
}

/**
 * S'abonne aux mises à jour de dossiers
 * @param callback - Fonction à exécuter lors de la mise à jour des dossiers
 * @returns Fonction pour se désabonner
 */
export function subscribeToDossierUpdates(callback: () => void): () => void {
  // Garantir que ce code ne s'exécute que côté client
  if (typeof window === 'undefined') return () => {};
  
  const handleUpdate = () => {
    console.log('Événement de mise à jour dossier reçu');
    callback();
  };
  
  // Ajouter l'écouteur d'événement
  window.addEventListener(DOSSIER_UPDATED_EVENT, handleUpdate);
  
  // Retourner une fonction pour supprimer l'écouteur
  return () => {
    window.removeEventListener(DOSSIER_UPDATED_EVENT, handleUpdate);
  };
}

/**
 * Hook qui s'abonne aux mises à jour de dossiers et déclenche un effet
 * À utiliser dans les composants React pour réagir aux mises à jour
 */
export function useDossierUpdates(callback: () => void) {
  // Garantir que ce code ne s'exécute que côté client
  if (typeof window === 'undefined') return;
  
  const handleUpdate = () => {
    console.log('Événement de mise à jour dossier reçu dans hook');
    callback();
  };
  
  // Configurer l'écouteur d'événement au montage du composant
  // et le nettoyer lors du démontage
  if (typeof window !== 'undefined') {
    window.addEventListener(DOSSIER_UPDATED_EVENT, handleUpdate);
    
    // Retourner une fonction de nettoyage
    return () => {
      window.removeEventListener(DOSSIER_UPDATED_EVENT, handleUpdate);
    };
  }
}