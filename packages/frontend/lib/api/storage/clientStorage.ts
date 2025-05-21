// Client Storage Service
// Utilitaire pour gérer le stockage local des clients

import { Client } from '@dtahc/shared';

// Clés de stockage
const STORAGE_KEY_CLIENTS = 'dtahc_clients';
const STORAGE_KEY_ACTIVE_CLIENTS = 'dtahc_active_clients';

/**
 * Récupérer tous les clients du stockage local
 */
export const getClientsFromStorage = (): Client[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedClients = localStorage.getItem(STORAGE_KEY_CLIENTS);
    if (!storedClients) return [];
    
    return JSON.parse(storedClients);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients du localStorage:', error);
    return [];
  }
};

/**
 * Récupérer un client par son ID depuis le stockage local
 */
export const getClientFromStorage = (clientId: string): Client | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const clients = getClientsFromStorage();
    
    // Chercher d'abord par ID exact
    let client = clients.find(c => c.id === clientId);
    
    // Si non trouvé, essayer différents formats d'ID
    if (!client) {
      const cleanId = clientId.replace('client_', '');
      const withPrefixId = clientId.startsWith('client_') ? clientId : `client_${clientId}`;
      
      client = clients.find(c => 
        c.id === cleanId || 
        c.id === withPrefixId
      );
    }
    
    // Marquer ce client comme actif
    if (client) {
      addActiveClient(client.id);
    }
    
    return client;
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId} du localStorage:`, error);
    return undefined;
  }
};

/**
 * Sauvegarder un client dans le stockage local
 */
export const saveClientToStorage = (client: Client): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const clients = getClientsFromStorage();
    
    // Vérifier si le client existe déjà
    const index = clients.findIndex(c => c.id === client.id);
    
    if (index >= 0) {
      // Mettre à jour le client existant
      clients[index] = { ...clients[index], ...client };
    } else {
      // Ajouter le nouveau client
      clients.push(client);
    }
    
    // Sauvegarder la liste mise à jour
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    
    // Ajouter aux clients actifs
    addActiveClient(client.id);
    
    // Déclencher un événement pour notifier les autres composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clientStorageUpdated'));
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde du client dans le localStorage:`, error);
    return false;
  }
};

/**
 * Supprimer un client du stockage local
 */
export const removeClientFromStorage = (clientId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const clients = getClientsFromStorage();
    const filteredClients = clients.filter(c => c.id !== clientId);
    
    // Vérifier si un client a été supprimé
    if (filteredClients.length === clients.length) {
      return false;
    }
    
    // Sauvegarder la liste mise à jour
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(filteredClients));
    
    // Supprimer des clients actifs
    removeActiveClient(clientId);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du client du localStorage:`, error);
    return false;
  }
};

/**
 * Ajouter un client à la liste des clients actifs
 */
export const addActiveClient = (clientId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const activeClients = JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVE_CLIENTS) || '[]');
    
    // Ne pas ajouter de doublons
    if (!activeClients.includes(clientId)) {
      activeClients.push(clientId);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CLIENTS, JSON.stringify(activeClients));
    }
  } catch (error) {
    console.error(`Erreur lors de l'ajout du client actif:`, error);
  }
};

/**
 * Supprimer un client de la liste des clients actifs
 */
export const removeActiveClient = (clientId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const activeClients = JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVE_CLIENTS) || '[]');
    const filteredActiveClients = activeClients.filter(id => id !== clientId);
    
    localStorage.setItem(STORAGE_KEY_ACTIVE_CLIENTS, JSON.stringify(filteredActiveClients));
  } catch (error) {
    console.error(`Erreur lors de la suppression du client actif:`, error);
  }
};

/**
 * Obtenir la liste des clients actifs
 */
export const getActiveClients = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVE_CLIENTS) || '[]');
  } catch (error) {
    console.error('Erreur lors de la récupération des clients actifs:', error);
    return [];
  }
};