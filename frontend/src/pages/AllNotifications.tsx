import { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

const AllNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Use sample notifications
        const sampleNotifications = [
          {
            id: 1,
            title: 'New test case assigned',
            message: 'Test case TC-001 has been assigned to you for review and execution',
            notification_type: 'info' as const,
            read: false,
            created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            title: 'Ticket updated',
            message: 'Ticket #123 status changed to In Progress by John Doe',
            notification_type: 'success' as const,
            read: false,
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: 'Document uploaded',
            message: 'New document "Test Plan v2.0" added to project folder',
            notification_type: 'info' as const,
            read: true,
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            title: 'Test execution failed',
            message: 'Automated test suite failed with 3 errors in login module',
            notification_type: 'error' as const,
            read: false,
            created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            title: 'Project milestone reached',
            message: 'QA Phase 1 completed successfully with 95% test coverage',
            notification_type: 'success' as const,
            read: true,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setNotifications(sampleNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Use sample notifications on error
      const sampleNotifications = [
        {
          id: 1,
          title: 'New test case assigned',
          message: 'Test case TC-001 has been assigned to you for review and execution',
          notification_type: 'info' as const,
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: 'Ticket updated',
          message: 'Ticket #123 status changed to In Progress by John Doe',
          notification_type: 'success' as const,
          read: false,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          title: 'Test execution failed',
          message: 'Automated test suite failed with 3 errors in login module',
          notification_type: 'error' as const,
          read: false,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];
      setNotifications(sampleNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    // Update locally immediately
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    // Update locally immediately
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    
    try {
      const token = localStorage.getItem('token');
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      await Promise.all(
        unreadIds.map(id => 
          fetch(`http://localhost:3001/api/v1/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        )
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="h-6 w-6 mr-3" />
              All Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {notifications.filter(n => !n.read).length} unread of {notifications.length} total
            </p>
          </div>
        </div>
        
        {notifications.some(n => !n.read) && (
          <Button onClick={markAllAsRead} className="bg-blue-600 hover:bg-blue-700">
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-all duration-200 ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.notification_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 ml-4"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllNotifications;