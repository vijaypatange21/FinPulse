import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, FileCheck, AlertTriangle, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return <Check className="w-4 h-4 text-emerald-400" />;
    case 'warning':
    case 'alert':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'document':
      return <FileCheck className="w-4 h-4 text-[var(--accent)]" />;
    case 'compliance':
      return <ShieldAlert className="w-4 h-4 text-purple-400" />;
    case 'loan':
      return <Sparkles className="w-4 h-4 text-emerald-400" />;
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } = useNotifications();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayedNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    return true;
  });

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.notification_id);
    }
    if (item.action_url) {
      setIsOpen(false);
      navigate(item.action_url);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title={isConnected ? 'Live WebSocket Connected' : 'Connecting to notifications...'}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-all cursor-pointer relative"
      >
        <Bell size={17} />

        {/* Live WebSocket connection pulse indicator */}
        <span
          className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border border-[var(--bg-surface-raised)] ${
            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--accent)] text-[var(--text-on-accent)] font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface-raised)] shadow-2xl border border-[var(--border-subtle)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--accent-tint)] text-[var(--accent)]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pt-2.5 pb-2 flex gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-raised)]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-raised)]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface-raised)]">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--bg-surface-raised)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-[var(--accent)]" />
                <p className="text-xs font-medium">No notifications to display</p>
                <p className="text-[10px] opacity-70 mt-1">
                  {activeTab === 'unread' ? 'All notifications are caught up.' : 'You will receive real-time updates here.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item.notification_id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-[var(--accent)]/10 cursor-pointer transition-colors relative ${
                    !item.is_read ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-surface-raised)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(item.notification_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs truncate ${
                          !item.is_read ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-[var(--text-secondary)] shrink-0 flex items-center gap-0.5">
                        <Clock size={10} />
                        {timeAgo(item.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isConnected ? 'Real-time WebSocket active' : 'Connecting...'}
            </span>
            <span className="opacity-70">FinPulse Live</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
