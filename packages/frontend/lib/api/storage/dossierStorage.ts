// Utilities for managing dossier storage in the browser

/**
 * Get all dossiers from localStorage
 */
export const getDossiersFromStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedDossiers = localStorage.getItem('dtahc_dossiers');
    if (storedDossiers) {
      return JSON.parse(storedDossiers);
    }
  } catch (error) {
    console.error('Error retrieving dossiers from localStorage:', error);
  }
  
  return [];
};

/**
 * Save dossiers to localStorage
 */
export const saveDossiersToStorage = (dossiers: any[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('dtahc_dossiers', JSON.stringify(dossiers));
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('dossierStorageUpdated'));
  } catch (error) {
    console.error('Error saving dossiers to localStorage:', error);
  }
};

/**
 * Get a specific dossier from localStorage
 */
export const getDossierFromStorage = (dossierId: string) => {
  const dossiers = getDossiersFromStorage();
  return dossiers.find((dossier: any) => dossier.id === dossierId);
};

/**
 * Save a specific dossier to localStorage
 */
export const saveDossierToStorage = (dossier: any) => {
  const dossiers = getDossiersFromStorage();
  const index = dossiers.findIndex((d: any) => d.id === dossier.id);
  
  if (index !== -1) {
    // Update existing dossier
    dossiers[index] = dossier;
  } else {
    // Add new dossier
    dossiers.push(dossier);
  }
  
  saveDossiersToStorage(dossiers);
};

/**
 * Remove a dossier from localStorage
 */
export const removeDossierFromStorage = (dossierId: string) => {
  const dossiers = getDossiersFromStorage();
  const updatedDossiers = dossiers.filter((d: any) => d.id !== dossierId);
  
  if (updatedDossiers.length !== dossiers.length) {
    saveDossiersToStorage(updatedDossiers);
    return true;
  }
  
  return false;
};

/**
 * Get all active dossiers
 */
export const getActiveDossiers = () => {
  const dossiers = getDossiersFromStorage();
  // Return all dossiers (we could filter by status if needed)
  return dossiers;
};

/**
 * Add an active dossier
 */
export const addActiveDossier = (dossier: any) => {
  saveDossierToStorage(dossier);
  // Always emit the dossierStorageUpdated event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dossierStorageUpdated'));
  }
};