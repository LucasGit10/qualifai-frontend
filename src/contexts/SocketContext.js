import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

const rawUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const SOCKET_URL = rawUrl.replace('/api', '');

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket deve ser usado dentro de um SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const { user, token, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !user?._id || !token) {
            if (socket) {
                console.log('[Socket] Disconnecting: User not authenticated');
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Se já está conectado, não faz nada
        if (socket?.connected) return;
        
        // Se já existe uma instância tentando conectar, não cria outra (debounce simples)
        if (socket && !socket.connected) return;

        console.log('[Socket] Attempting connection:', {
            url: SOCKET_URL,
            userId: user._id,
        });

        const newSocket = io(SOCKET_URL, {
            auth: {
                userId: user._id,
                token: token
            },
            // Removemos a restrição de transportes para permitir a melhor negociação (WS ou Polling)
            path: '/socket.io/',
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected!', newSocket.id);
            setIsConnected(true);

            // Entra na sala individual do usuário para receber notificações privadas
            newSocket.emit('join-room', user._id);
            newSocket.emit('join-room', `user-${user._id}`);

            newSocket.emit('test_connection', {
                userId: user._id,
                message: 'Connected from frontend'
            });
        });

        newSocket.on('test_response', (data) => {
            console.log('Server response:', data);
        });

        newSocket.on('notification', (data) => {
            
            const newNotification = {
                ...data.data,
                id: data.data._id || data.data.id,
                _id: data.data._id, 
                timestamp: data.data.createdAt || new Date().toISOString(),
                isRead: data.data.isRead || false
            };

            setNotifications(prev => [newNotification, ...prev]);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
              // o servidor desconectou, precisamos reconectar manualmente
              newSocket.connect();
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('[Socket] Connection Error:', error.message);
            setIsConnected(false);
        });

        newSocket.on('error', (error) => {
            console.error('[Socket] General Error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, user?._id, token]);

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            loadNotifications();
        }
    }, [isAuthenticated, user?._id]);

    const loadNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const isValidObjectId = (id) =>
        typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

    const markAsRead = async (notificationId) => {
        if (!isValidObjectId(notificationId)) {
            console.error('Invalid ID for markAsRead:', notificationId);
            return;
        }
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n =>
                    (n._id === notificationId || n.id === notificationId)
                        ? { ...n, isRead: true }
                        : n
                )
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        if (!isValidObjectId(notificationId)) {
            console.error('Invalid ID for delete:', notificationId);
            return;
        }
        try {
            await api.delete(`/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n.id !== notificationId && n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await api.delete('/notifications/clear-all');
            setNotifications([]);
        } catch (error) {
            console.error('Error deleting all notifications:', error);
        }
    };

    const value = {
        socket,
        notifications,
        isConnected,
        unreadCount: notifications.filter(n => !n.isRead).length,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
