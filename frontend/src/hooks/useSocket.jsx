import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
  };
}
