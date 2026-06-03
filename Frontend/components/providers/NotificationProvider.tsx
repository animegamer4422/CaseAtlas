'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthProvider';
import io from 'socket.io-client';

export interface Notification {
  _id: string;
  userId: string;
  caseId?: {
    _id: string;
    caseId: string;
    title: string;
  };
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllRead: async () => {},
  clearAll: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then((data) => setNotifications(data))
        .catch((err) => console.error('Failed to load notifications', err));
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Connect to Socket.IO for real-time notifications
  useEffect(() => {
    if (!user) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      // Join the user's personal room to receive targeted notifications
      socket.emit('join_user', { userId: user._id });
    });

    socket.on('notification', (newNotif: Notification) => {
      // We get a new notification event from the backend
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`, {});
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      // Revert if failed (optional, simplified here)
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    
    // Call the API for each one since backend only supports single read endpoint right now
    try {
      await Promise.all(unreadIds.map(id => api.patch(`/notifications/${id}/read`, {})));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const clearAll = () => {
    // Backend doesn't have a delete endpoint, so we just clear locally for this session
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}
