import { useState, useEffect, useCallback } from 'react';
import { Bell, MessageCircle, Users, ShoppingBag, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api/notifications';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'messages') params.type = 'message';
      if (filter === 'groups') params.type = 'study-group';
      if (filter === 'marketplace') params.type = 'marketplace';
      if (filter === 'unread') params.read = 'false';
      const response = await fetchNotifications({ ...params, page, limit: 5 });
      
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.meta.unreadCount);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'study-group': return Users;
      case 'marketplace': return ShoppingBag;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'message': return 'text-blue-600';
      case 'study-group': return 'text-green-600';
      case 'marketplace': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'message': return 'bg-blue-100';
      case 'study-group': return 'bg-green-100';
      case 'marketplace': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'messages') return notif.type === 'message';
    if (filter === 'groups') return notif.type === 'study-group';
    if (filter === 'marketplace') return notif.type === 'marketplace';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell size={32} />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-gray-600 mt-1">{unreadCount} unread notifications</p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'messages', label: 'Messages' },
          { id: 'groups', label: 'Study Groups' },
          { id: 'marketplace', label: 'Marketplace' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === tab.id 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getIcon(notification.type);
            return (
              <Card key={notification._id} className={`transition-all ${
                !notification.read ? 'border-l-4 border-l-black bg-gray-50' : ''
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getIconBg(notification.type)}`}>
                    <IconComponent size={20} className={getIconColor(notification.type)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${!notification.read ? 'text-black' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
            disabled={page >= meta.totalPages}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
