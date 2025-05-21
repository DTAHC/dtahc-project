import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, getTasks, updateTask, deleteTask } from '@/lib/api/tasks';
import TaskItem from './TaskItem';
import { Check, CheckCircle, Clock, Filter, Plus, Search, SortAsc, Trash, X } from 'lucide-react';

interface TaskListProps {
  clientId: string;
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
  refreshTrigger?: number;
}

const TaskList: React.FC<TaskListProps> = ({ 
  clientId, 
  onAddTask, 
  onEditTask,
  refreshTrigger = 0
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'createdAt'>('dueDate');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(clientId);
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      setError('Impossible de charger les tâches');
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    fetchTasks();
  }, [clientId, refreshTrigger]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return !a.dueDate 
            ? 1 
            : !b.dueDate 
              ? -1 
              : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { 'Haute': 0, 'Moyenne': 1, 'Basse': 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          const statusOrder = { 
            [TaskStatus.PENDING]: 1, 
            [TaskStatus.IN_PROGRESS]: 0, 
            [TaskStatus.COMPLETED]: 2, 
            [TaskStatus.CANCELLED]: 3 
          };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, sortBy]);

  // Handle status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      
      // Update the local state
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }
    
    try {
      await deleteTask(taskId);
      
      // Update the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Tâches</h3>
        {onAddTask && (
          <button 
            onClick={onAddTask}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Nouvelle tâche</span>
          </button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
        >
          <option value="">Tous les statuts</option>
          {Object.values(TaskStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
        >
          <option value="dueDate">Trier par échéance</option>
          <option value="priority">Trier par priorité</option>
          <option value="status">Trier par statut</option>
          <option value="createdAt">Trier par date de création</option>
        </select>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-600">Chargement des tâches...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchTasks}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-8 text-center border border-gray-200 rounded-lg">
          {searchQuery || statusFilter ? (
            <>
              <p className="text-gray-500 mb-2">Aucune tâche ne correspond à vos critères</p>
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
                className="text-blue-600 hover:text-blue-800"
              >
                Réinitialiser les filtres
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-2">Aucune tâche n'a été créée pour ce client</p>
              {onAddTask && (
                <button 
                  onClick={onAddTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  <span>Créer une tâche</span>
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task}
              onEdit={onEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Quick stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 border border-gray-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Terminées</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {tasks.filter(task => task.status === TaskStatus.COMPLETED).length}
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">En cours</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length}
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg bg-amber-50">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">En attente</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {tasks.filter(task => task.status === TaskStatus.PENDING).length}
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <X size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Annulées</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {tasks.filter(task => task.status === TaskStatus.CANCELLED).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;