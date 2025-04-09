 import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url, eventName = 'dashboard-data') => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(url);

    socket.on(eventName, (payload) => {
      setData(payload);
    });

    socket.on('connect', () => {
      console.log('🟢 Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [url, eventName]);

  return data;
};

export default useSocket;
