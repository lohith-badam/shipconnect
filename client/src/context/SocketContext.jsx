import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('joinRoom', user._id);
      });

      socket.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('newShipment', () => {
        setUnreadCount(prev => prev + 1);
      });

      socket.on('shipmentMatch', () => {
        setUnreadCount(prev => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, notifications, unreadCount, setUnreadCount, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
