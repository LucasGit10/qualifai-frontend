import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
    });
    
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO com id:', this.socket.id);
      if (userId) {
        this.socket.emit('join-room', `user-${userId}`);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.IO');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }
}

export default new SocketService();
