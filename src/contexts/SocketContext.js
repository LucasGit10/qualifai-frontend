import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

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
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }
        if (socket?.connected) {
            return;
        }
        
        console.log('Connecting to the socket with:', {
            userId: user._id,
            hasToken: !!token
        });

        const newSocket = io('http://localhost:3001', {
            auth: {
                userId: user._id,
                token: token
            },
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            setIsConnected(true);

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
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket.io connection error:', error.message);
            setIsConnected(false);
        });

        newSocket.on('error', (error) => {
            console.error('Socket.io error:', error);
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
            const response = await fetch('http://localhost:3001/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            console.log('markAsRead called with ID:', {
                notificationId,
                type: typeof notificationId,
                value: notificationId
            });

            if (!notificationId || 
                notificationId === 'undefined' || 
                notificationId === 'null' ||
                notificationId === '' ||
                typeof notificationId !== 'string') {
                console.error('Invalid ID for markAsRead:', notificationId);
                return;
            }

            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (!objectIdRegex.test(notificationId)) {
                console.error('Invalid ID for markAsRead:', notificationId);
                return;
            }
            
            const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response:', response.status);

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n =>
                        (n._id === notificationId || n.id === notificationId) 
                            ? { ...n, isRead: true } 
                            : n
                    )
                );
            } else {
                const errorText = await response.text();
                console.error('Error in response:', errorText);
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('http://localhost:3001/api/notifications/read-all', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            if (!notificationId || notificationId === 'undefined' || notificationId === 'null') {
                console.error('Invalid ID for delete:', notificationId);
                return;
            }

            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (!objectIdRegex.test(notificationId)) {
                console.error('Invalid ID for delete:', notificationId);
                return;
            }

            await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setNotifications(prev => prev.filter(n => n.id !== notificationId && n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const value = {
        socket,
        notifications,
        isConnected,
        unreadCount: notifications.filter(n => !n.isRead).length,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};