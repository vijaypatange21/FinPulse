import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getAuthToken, getCurrentUser, listNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, FileCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Fetch initial notification list
  const fetchNotifications = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const data = await listNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
        const unread = data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  }, []);

  // Connect WebSocket
  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      const token = getAuthToken();
      const user = getCurrentUser();

      if (!token || !user) {
        setIsConnected(false);
        return;
      }

      // Determine backend host
      const host = window.location.hostname || 'localhost';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${host}:8000/ws/notifications/?token=${token}`;

      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'notification' && data.data) {
              const newNotif = data.data;

              // Prepend to state
              setNotifications((prev) => {
                const exists = prev.some((n) => n.notification_id === newNotif.notification_id);
                if (exists) return prev;
                return [newNotif, ...prev];
              });
              setUnreadCount((prev) => prev + 1);

              // Trigger real-time popup toast
              setActiveToast({
                id: newNotif.notification_id || Date.now(),
                title: newNotif.title,
                message: newNotif.message,
                type: newNotif.notification_type || 'info',
                action_url: newNotif.action_url,
              });

              // Auto-dismiss toast after 6 seconds
              setTimeout(() => {
                setActiveToast((curr) => (curr && curr.id === newNotif.notification_id ? null : curr));
              }, 6000);
            }
          } catch (e) {
            console.error('Error handling WebSocket message:', e);
          }
        };

        socket.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          // Try reconnecting in 4s if still mounted
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, 4000);
        };

        socket.onerror = () => {
          if (wsRef.current) wsRef.current.close();
        };
      } catch (err) {
        console.warn('WebSocket connection error:', err);
      }
    };

    fetchNotifications();
    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'document':
      case 'compliance':
        return <FileCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}

      {/* Real-Time WebSocket Toast Notification Popup */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-[var(--bg-surface-raised)] rounded-2xl p-4 shadow-2xl border border-[var(--border-subtle)] flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-tint)] flex items-center justify-center shrink-0">
              {getToastIcon(activeToast.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  Live Alert
                </span>
                <button
                  onClick={() => setActiveToast(null)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] mt-0.5 leading-snug">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                {activeToast.message}
              </p>

              {activeToast.action_url && (
                <div className="mt-2.5">
                  <Link
                    to={activeToast.action_url}
                    onClick={() => setActiveToast(null)}
                    className="inline-flex items-center text-[11px] font-semibold text-[var(--accent)] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
