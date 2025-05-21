import React, { useEffect, useState } from 'react';
import { Bell, Check, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'action' | 'system' | 'info';
  status: 'unread' | 'read';
  createdAt: string;
  link?: string;
  clientId?: string;
  taskId?: string;
  dossierRef?: string;
  fromUser?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Load notifications from localStorage or mock data for now
    // This would be replaced with an API call in production
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem('dtahc_notifications');
        if (stored) {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
          setUnreadCount(parsed.filter((n: Notification) => n.status === 'unread').length);
        } else {
          // Mock data for demonstration
          const mock: Notification[] = [
            {
              id: 'notif_1',
              title: 'Nouvelle tâche assignée',
              message: 'Admin vous a assigné une tâche: "Vérifier les documents fournis"',
              type: 'task',
              status: 'unread',
              createdAt: new Date().toISOString(),
              link: '/clients/client_8r81doh',
              clientId: 'client_8r81doh',
              taskId: 'task_1',
              dossierRef: 'DOSS-2023-042',
              fromUser: 'Admin'
            },
            {
              id: 'notif_2',
              title: 'Rappel: Échéance proche',
              message: 'La tâche "Relancer client pour photos" arrive à échéance demain',
              type: 'info',
              status: 'unread',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              link: '/clients/client_2',
              clientId: 'client_2',
              taskId: 'task_2',
              dossierRef: 'DOSS-2023-043',
              fromUser: 'Système'
            }
          ];
          setNotifications(mock);
          setUnreadCount(mock.length);
          localStorage.setItem('dtahc_notifications', JSON.stringify(mock));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };

    loadNotifications();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);  // Vide les dépendances pour que ça ne se recharge qu'une fois

  useEffect(() => {
    // Listen for new task assignments
    const handleNewTaskAssigned = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.task) {
        const { task, assignedBy, clientName, clientId, dossierRef } = customEvent.detail;
        
        const newNotification: Notification = {
          id: `notif_${Date.now()}`,
          title: 'Nouvelle tâche assignée',
          message: `${assignedBy || 'Un utilisateur'} vous a assigné une tâche: "${task.title}"`,
          type: 'task',
          status: 'unread',
          createdAt: new Date().toISOString(),
          link: `/clients/${clientId}`,
          clientId,
          taskId: task.id,
          dossierRef,
          fromUser: assignedBy
        };
        
        // Utiliser une fonction de mise à jour qui ne dépend pas de l'état actuel
        setNotifications(prev => {
          const updatedNotifications = [newNotification, ...prev];
          localStorage.setItem('dtahc_notifications', JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
        
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nouvelle tâche assignée', {
            body: `${assignedBy || 'Un utilisateur'} vous a assigné une tâche: "${task.title}" pour le client ${clientName || ''}`,
            icon: '/favicon.ico',
          });
        }
      }
    };

    window.addEventListener('taskAssigned', handleNewTaskAssigned);
    
    return () => {
      window.removeEventListener('taskAssigned', handleNewTaskAssigned);
    };
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, status: 'read' } : notif
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => n.status === 'unread').length);
    localStorage.setItem('dtahc_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, status: 'read' }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('dtahc_notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(notif => notif.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => n.status === 'unread').length);
    localStorage.setItem('dtahc_notifications', JSON.stringify(updated));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button 
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
          <div className="py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50 px-4">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-gray-500 text-sm">
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                    notification.status === 'unread' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className={`text-sm font-medium ${
                      notification.status === 'unread' ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      {notification.status === 'unread' && (
                        <button 
                          onClick={() => markAsRead(notification.id)} 
                          className="text-gray-400 hover:text-green-600"
                          title="Marquer comme lu"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)} 
                        className="text-gray-400 hover:text-red-600"
                        title="Supprimer la notification"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  
                  {notification.clientId && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">Client:</span> {notification.clientId.replace('client_', '')}
                      {notification.dossierRef && (
                        <span className="ml-2">
                          <span className="font-medium">Dossier:</span> {notification.dossierRef}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString('fr-FR', { 
                        dateStyle: 'short', 
                        timeStyle: 'short' 
                      })}
                    </span>
                    {notification.link && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye size={12} /> Voir détails
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="py-2 px-4 bg-gray-50 text-xs text-center text-gray-500 border-t border-gray-200">
            <Link href="/notifications" className="hover:text-blue-600">
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}