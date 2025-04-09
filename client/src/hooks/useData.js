import { useState, useEffect } from 'react';
import useAxios from './useAxios';
import useSocket from './useSocket';

const useData = ({
  apis = [],
  filters = {},
  socketConfig = { url: null, events: [] }, // Always define socketConfig
}) => {
  const [data, setData] = useState(null);
  const [source, setSource] = useState('axios'); // 'axios' | 'socket'
  const [socketError, setSocketError] = useState(null);

  const { response: axiosResponse, loading, error } = useAxios(apis?.length ? { apis, filters } : []);

  // Always call useSocket, even with no config
  const socketData = useSocket(socketConfig.url, socketConfig.events);

  useEffect(() => {
    const availableSocketData = socketConfig?.events
      ?.map((evt) => socketData?.[evt])
      ?.find((d) => d);

    if (availableSocketData) {
      setData(availableSocketData);
      setSource('socket');
    } else if (axiosResponse && source !== 'socket') {
      setData(axiosResponse);
      setSource('axios');
    }
  }, [axiosResponse, socketData]);

  useEffect(() => {
    const errorEvent = socketData?.error || socketData?.['dashboard-error'];
    if (errorEvent) {
      setSocketError(errorEvent);
    }
  }, [socketData]);

  return {
    data,
    loading,
    error: error || socketError,
    source,
  };
};

export default useData;
