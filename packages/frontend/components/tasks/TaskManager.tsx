import React, { useState } from 'react';
import { createTask, Task, CreateTaskDto, updateTask } from '@/lib/api/tasks';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Loader, X } from 'lucide-react';

interface TaskManagerProps {
  clientId: string;
  users?: { id: string; name: string }[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ clientId, users }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submit for task creation or update
  const handleTaskSubmit = async (taskData: CreateTaskDto) => {
    try {
      setIsSubmitting(true);
      
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, taskData);
        setNotification({ type: 'success', message: 'Tâche mise à jour avec succès' });
      } else {
        // Create new task
        await createTask(taskData);
        setNotification({ type: 'success', message: 'Tâche créée avec succès' });
      }
      
      // Close form and refresh task list
      setShowForm(false);
      setEditingTask(null);
      setRefreshTrigger(prev => prev + 1);
      
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de la soumission de la tâche:', error);
      setNotification({ 
        type: 'error', 
        message: 'Une erreur est survenue lors de l\'enregistrement de la tâche' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task edit
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
          'bg-red-50 border border-red-200 text-red-800'
        } flex justify-between items-center`}>
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Task form (shown when creating or editing a task) */}
      {showForm ? (
        <TaskForm 
          initialTask={editingTask || undefined}
          clientId={clientId}
          onSubmit={handleTaskSubmit}
          onCancel={handleCancel}
          users={users}
        />
      ) : (
        <TaskList 
          clientId={clientId}
          onAddTask={() => setShowForm(true)}
          onEditTask={handleEditTask}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex items-center gap-3">
            <Loader className="animate-spin text-blue-600" />
            <span>Traitement en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;