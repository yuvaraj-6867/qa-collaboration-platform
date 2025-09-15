import { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    // Listen for notification events
    window.addEventListener('userCreated', handleUserCreated);
    window.addEventListener('userAssigned', handleUserAssigned);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    
    return () => {
      window.removeEventListener('userCreated', handleUserCreated);
      window.removeEventListener('userAssigned', handleUserAssigned);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const loadNotifications = () => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
    }
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      notification_type: type,
      read: false,
      created_at: new Date().toISOString()
    };
    const updated = [newNotification, ...notifications];
    saveNotifications(updated);
  };

  const handleUserCreated = (event: any) => {
    const { username } = event.detail;
    addNotification('User Created', `New user ${username} has been created`, 'success');
  };

  const handleUserAssigned = (event: any) => {
    const { taskName, assignee } = event.detail;
    addNotification('Task Assigned', `${taskName} has been assigned to ${assignee}`, 'info');
  };

  const handleUserLoggedIn = (event: any) => {
    const { username } = event.detail;
    addNotification('User Login', `${username} has logged in`, 'info');
  };

  const markAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  (window as any).addNotification = addNotification;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-cyan-100 dark:hover:from-purple-900/30 dark:hover:to-cyan-900/30 transition-all duration-300 hover:scale-110 btn-ripple"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-custom animate-glow">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 glass border border-purple-200/30 dark:border-cyan-200/30 rounded-xl shadow-2xl z-50 overflow-hidden animate-scaleIn">
          <div className="px-4 py-3 bg-gradient-accent border-b border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-gradient-to-r from-purple-400 to-cyan-400 text-white px-3 py-1 rounded-full animate-shimmer">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 card-hover ${
                    !notification.read ? 'bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-l-4 border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-purple-100 hover:to-cyan-100 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 btn-ripple"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-t border-white/20">
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/notifications');
                }}
                className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-all duration-300 hover:scale-105"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;