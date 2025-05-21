// API client pour les tâches
// À adapter avec vos endpoints réels

import axios from 'axios';
import { 
  saveTaskToStorage, 
  getTasksFromStorage, 
  getTaskFromStorage,
  removeTaskFromStorage
} from './storage/taskStorage';

// Types pour les tâches
export enum TaskStatus {
  PENDING = 'En attente',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée',
  CANCELLED = 'Annulée'
}

export enum TaskPriority {
  LOW = 'Basse',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  clientId: string;
}

// Fonction pour retourner des données mockées pour les tests
const mockTasks = (clientId: string) => [
  {
    id: 'task_1',
    title: 'Relancer le client pour obtenir des photos',
    description: 'Nous avons besoin de photos de la façade pour compléter le dossier',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: 'user_1',
    clientId: clientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: {
      id: 'user_1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com'
    }
  },
  {
    id: 'task_2',
    title: 'Vérifier les documents fournis',
    description: 'Vérifier que tous les documents nécessaires ont été fournis',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: 'user_2',
    clientId: clientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: {
      id: 'user_2',
      firstName: 'Support',
      lastName: 'Agent',
      email: 'support@example.com'
    }
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Vérifier qu'on est côté client avant d'utiliser localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Créer une nouvelle tâche
export const createTask = async (taskData: CreateTaskDto) => {
  try {
    console.log('Création de tâche:', taskData);

    // Pour les tests en l'absence d'API - stocke les tâches dans localStorage
    if (!process.env.NEXT_PUBLIC_API_URL || window.location.hostname === 'localhost') {
      // Simuler un appel API réussi
      const newTaskId = 'task_' + Math.random().toString(36).substring(2, 9);
      
      // Structure de données compatible avec l'affichage
      const newTask = {
        id: newTaskId,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || TaskStatus.PENDING,
        priority: taskData.priority || TaskPriority.MEDIUM,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined,
        assigneeId: taskData.assigneeId,
        clientId: taskData.clientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: taskData.assigneeId ? {
          id: taskData.assigneeId,
          firstName: 'Assignee',
          lastName: 'User',
          email: 'user@example.com'
        } : undefined
      };
      
      // Utiliser notre service de stockage
      saveTaskToStorage(newTask);
      
      console.log('Tâche créée et sauvegardée:', newTask);
      
      // Notifier les autres composants
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
      }
      
      return {
        data: newTask
      };
    }
    
    // Appel API réel si nous ne sommes pas en local/test
    const response = await apiClient.post('/tasks', taskData);
    
    // Si nous avons créé la tâche via l'API, stockons-la localement
    if (response.data && typeof window !== 'undefined') {
      saveTaskToStorage(response.data);
      
      // Notifier les autres composants de la création réussie de la tâche
      window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
    }
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw error;
  }
};

// Récupérer toutes les tâches
export const getTasks = async (clientId?: string) => {
  try {
    const url = clientId ? `/tasks?clientId=${clientId}` : '/tasks';
    console.log('Récupération des tâches depuis:', url);

    // Vérifier si nous sommes en local/test
    if (!process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
      console.log('Récupération des tâches depuis le service de stockage');
      
      // Utiliser notre service de stockage
      let tasks = getTasksFromStorage();
      
      // S'assurer que nous sommes côté client
      if (typeof window === 'undefined') {
        // Nous sommes côté serveur, retourner directement les données mockées
        return { 
          data: clientId ? mockTasks(clientId) : [] 
        };
      }
      
      // Si aucune tâche n'existe encore, utiliser des données de démonstration
      if (!tasks || tasks.length === 0) {
        tasks = clientId ? mockTasks(clientId) : [];
        
        // Sauvegarder les tâches de démonstration
        tasks.forEach(task => {
          saveTaskToStorage(task);
        });
      } else if (clientId) {
        // Filtrer les tâches par clientId si fourni
        tasks = tasks.filter(task => task.clientId === clientId);
      }
      
      return { data: tasks };
    }
    
    // Appel API réel si nous ne sommes pas en local/test
    const response = await apiClient.get(url);
    
    // Si nous obtenons des tâches depuis l'API, les stocker localement
    if (response.data && typeof window !== 'undefined') {
      if (Array.isArray(response.data)) {
        response.data.forEach(task => {
          saveTaskToStorage(task);
        });
      } else if (response.data.id) {
        // C'est une seule tâche
        saveTaskToStorage(response.data);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    throw error;
  }
};

// Récupérer une tâche par son ID
export const getTaskById = async (taskId: string) => {
  try {
    console.log('Récupération de la tâche avec ID:', taskId);
    
    // Vérifier si nous sommes en local/test
    if (!process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
      // Utiliser le service de stockage
      const task = getTaskFromStorage(taskId);
      
      if (task) {
        console.log('Tâche trouvée dans le stockage local:', task.id);
        return { data: task };
      } else {
        console.error(`Tâche avec ID ${taskId} non trouvée dans le stockage local`);
        throw new Error(`Tâche avec ID ${taskId} non trouvée`);
      }
    }
    
    // Appel API réel si nous ne sommes pas en local/test
    const response = await apiClient.get(`/tasks/${taskId}`);
    
    // Si nous avons obtenu la tâche depuis l'API, stockons-la localement
    if (response.data && typeof window !== 'undefined') {
      saveTaskToStorage(response.data);
    }
    
    return response;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la tâche ${taskId}:`, error);
    throw error;
  }
};

// Mettre à jour une tâche
export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  try {
    console.log('Mise à jour de la tâche:', taskId, taskData);
    
    // Vérifier si nous sommes en local/test
    if (!process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
      // Récupérer la tâche depuis le stockage
      const task = getTaskFromStorage(taskId);
      
      if (!task) {
        throw new Error(`Tâche avec ID ${taskId} non trouvée`);
      }
      
      // Mettre à jour la tâche
      const updatedTask = {
        ...task,
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      
      // Sauvegarder la tâche mise à jour
      saveTaskToStorage(updatedTask);
      
      // Notifier les autres composants
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
      }
      
      return { data: updatedTask };
    }
    
    // Appel API réel si nous ne sommes pas en local/test
    const response = await apiClient.patch(`/tasks/${taskId}`, taskData);
    
    // Si nous avons mis à jour la tâche via l'API, mettons à jour le stockage local
    if (response.data && typeof window !== 'undefined') {
      saveTaskToStorage(response.data);
      
      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
    }
    
    return response;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
    throw error;
  }
};

// Supprimer une tâche
export const deleteTask = async (taskId: string) => {
  try {
    console.log('Suppression de la tâche:', taskId);
    
    // Vérifier si nous sommes en local/test
    if (!process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
      // Vérifier que la tâche existe
      const task = getTaskFromStorage(taskId);
      
      if (!task) {
        throw new Error(`Tâche avec ID ${taskId} non trouvée`);
      }
      
      // Supprimer la tâche du stockage
      removeTaskFromStorage(taskId);
      
      // Notifier les autres composants
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
      }
      
      return { data: { success: true } };
    }
    
    // Appel API réel si nous ne sommes pas en local/test
    const response = await apiClient.delete(`/tasks/${taskId}`);
    
    // Si nous avons supprimé la tâche via l'API, mettons à jour le stockage local
    if (response.data && typeof window !== 'undefined') {
      removeTaskFromStorage(taskId);
      
      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('taskStorageUpdated'));
    }
    
    return response;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
    throw error;
  }
};

// Export d'un API client pour usage externe
export const tasksApi = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};