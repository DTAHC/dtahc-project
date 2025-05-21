import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, CreateTaskDto } from '@/lib/api/tasks';
import { AlertCircle, Check, Clock, Flag, User, X } from 'lucide-react';

interface TaskFormProps {
  initialTask?: Task;
  clientId: string;
  onSubmit: (taskData: CreateTaskDto) => Promise<void>;
  onCancel: () => void;
  users?: { id: string; name: string }[];
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialTask, 
  clientId,
  onSubmit, 
  onCancel,
  users = [
    { id: 'user_1', name: 'Admin' },
    { id: 'user_2', name: 'Support' },
    { id: 'user_3', name: 'Technique' }
  ]
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || TaskStatus.PENDING);
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>(
    initialTask?.dueDate 
      ? new Date(initialTask.dueDate).toISOString().split('T')[0]
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [assigneeId, setAssigneeId] = useState<string | undefined>(initialTask?.assigneeId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    const taskData: CreateTaskDto = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      assigneeId,
      clientId
    };

    try {
      setIsSubmitting(true);
      await onSubmit(taskData);
      
      // Dispatch task assigned event for notifications
      if (assigneeId) {
        const assignerName = 'Admin DTAHC'; // Normally would get from auth context
        const clientName = clientId.replace('client_', '');
        const dossierRef = 'DOSS-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        const event = new CustomEvent('taskAssigned', {
          detail: {
            task: {
              ...taskData,
              id: 'task_' + Date.now(),
              createdAt: new Date().toISOString()
            },
            assignedBy: assignerName,
            clientName,
            clientId,
            dossierRef
          }
        });
        
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la tâche:', error);
      setError('Une erreur est survenue lors de la création de la tâche');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {initialTask ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Titre de la tâche"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Description détaillée de la tâche"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.values(TaskStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.values(TaskPriority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date d'échéance
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">
            Assignée à
          </label>
          <select
            id="assigneeId"
            value={assigneeId || ''}
            onChange={(e) => setAssigneeId(e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Non assignée</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>{initialTask ? 'Mettre à jour' : 'Créer la tâche'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;