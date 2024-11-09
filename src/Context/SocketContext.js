import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};