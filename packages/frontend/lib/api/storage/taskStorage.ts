/**
 * Service optimisé pour le stockage et la récupération des tâches
 * Ce service utilise localStorage avec des optimisations de performance
 */

import { Task } from '../tasks';

// Clé pour stocker les tâches dans localStorage
const TASKS_STORAGE_KEY = 'dtahc_tasks';

// Fonction pour enregistrer une tâche dans le stockage local
export const saveTaskToStorage = (task: Task): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Récupérer les tâches existantes
    let tasks: Task[] = [];
    const tasksStorageJson = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (tasksStorageJson) {
      tasks = JSON.parse(tasksStorageJson);
    }
    
    // Rechercher si la tâche existe déjà
    const existingTaskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingTaskIndex >= 0) {
      // Mettre à jour la tâche existante
      tasks[existingTaskIndex] = { ...task };
    } else {
      // Ajouter la nouvelle tâche
      tasks.push(task);
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la tâche dans le stockage local:', error);
  }
};

// Fonction pour récupérer toutes les tâches du stockage local
export const getTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const tasksStorageJson = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (tasksStorageJson) {
      return JSON.parse(tasksStorageJson);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches du stockage local:', error);
  }
  
  return [];
};

// Fonction pour récupérer une tâche spécifique par son ID
export const getTaskFromStorage = (taskId: string): Task | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const tasksStorageJson = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (tasksStorageJson) {
      const tasks = JSON.parse(tasksStorageJson);
      return tasks.find((task: Task) => task.id === taskId) || null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de la tâche ${taskId} du stockage local:`, error);
  }
  
  return null;
};

// Fonction pour supprimer une tâche du stockage local
export const removeTaskFromStorage = (taskId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const tasksStorageJson = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (tasksStorageJson) {
      let tasks = JSON.parse(tasksStorageJson);
      
      // Filtrer la tâche à supprimer
      const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
      
      // Si aucune tâche n'a été supprimée, retourner false
      if (updatedTasks.length === tasks.length) {
        return false;
      }
      
      // Sauvegarder les tâches mises à jour
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      return true;
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la tâche ${taskId} du stockage local:`, error);
  }
  
  return false;
};

// Fonction pour récupérer les tâches d'un client spécifique
export const getClientTasksFromStorage = (clientId: string): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const tasksStorageJson = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (tasksStorageJson) {
      const tasks = JSON.parse(tasksStorageJson);
      return tasks.filter((task: Task) => task.clientId === clientId);
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des tâches du client ${clientId} du stockage local:`, error);
  }
  
  return [];
};