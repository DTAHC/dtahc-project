import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/lib/api/tasks';
import { Check, Clock, Edit, Flag, Trash, X } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format due date
  const formatDueDate = (dueDate: string | undefined) => {
    if (!dueDate) return 'Non spécifiée';
    return new Date(dueDate).toLocaleDateString('fr-FR');
  };

  // Get priority icon and color
  const getPriorityDisplay = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { icon: <Flag size={16} />, color: 'text-red-600 bg-red-50' };
      case TaskPriority.MEDIUM:
        return { icon: <Flag size={16} />, color: 'text-amber-600 bg-amber-50' };
      case TaskPriority.LOW:
        return { icon: <Flag size={16} />, color: 'text-blue-600 bg-blue-50' };
      default:
        return { icon: <Flag size={16} />, color: 'text-gray-600 bg-gray-50' };
    }
  };

  // Get status badge color
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.PENDING:
        return 'bg-amber-100 text-amber-800';
      case TaskStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  const priorityDisplay = getPriorityDisplay(task.priority);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-200 transition-colors">
      <div className="p-4">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {task.status === TaskStatus.COMPLETED ? (
              <button 
                onClick={() => handleStatusChange(TaskStatus.PENDING)} 
                className="mr-2 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
              >
                <Check size={12} />
              </button>
            ) : (
              <button 
                onClick={() => handleStatusChange(TaskStatus.COMPLETED)} 
                className="mr-2 w-5 h-5 rounded-full border border-gray-300 hover:border-green-500 hover:bg-green-50"
              />
            )}
            <h3 className={`font-medium ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Task details (visible when expanded) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {task.description && (
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <div className={`px-2 py-1 rounded-md flex items-center gap-1 ${priorityDisplay.color}`}>
                {priorityDisplay.icon}
                <span>Priorité: {task.priority}</span>
              </div>
              <div className="px-2 py-1 bg-gray-50 rounded-md flex items-center gap-1">
                <Clock size={12} />
                <span>Échéance: {formatDueDate(task.dueDate)}</span>
              </div>
              {task.assignee && (
                <div className="px-2 py-1 bg-gray-50 rounded-md">
                  Assignée à: {task.assignee.firstName} {task.assignee.lastName}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer with status and actions */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-1 text-gray-400 hover:text-gray-700"
            >
              {isExpanded ? 'Réduire' : 'Détails'}
            </button>
            {onEdit && (
              <button 
                onClick={() => onEdit(task)} 
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(task.id)} 
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;