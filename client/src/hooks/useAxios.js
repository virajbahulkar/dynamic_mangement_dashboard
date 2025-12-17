/* eslint-disable no-console */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';

// Deprecated: replace usage with useDataSource.
const useAxios = () => {
  // Soft deprecation notice; returns empty shape
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[deprecation] useAxios: use useDataSource instead.');
  }
  return { response: [], error: null, loading: false };
};

export default useAxios;

/*
Original implementation retained below for reference (will be removed):
const legacyUseAxios = ({ apis = [], filtersForBody = {}, pollingInterval = null }) => {
  const [response, setResponse] = useState([]);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const pollingRef = useRef(null);

  const generateConfig = (headers = {}, accessToken = '') => ({
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      ...headers,
    },
  });


  useEffect(() => {
    const authApi = apis.find((api) => api.isAuthApi);
    if (authApi) {
      (async () => {
        try {
          const { url, method = 'post', body, headers, baseUrl } = authApi;
          const axiosInstance = axios.create({ baseURL: baseUrl });
          const bodyObj = qs.stringify(body);
          const config = generateConfig(headers);
          const res = await axiosInstance[method](url, bodyObj, config);
          if (res.data.access_token) {
            setToken(`Bearer ${res.data.access_token}`);
          }
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      })();
    } else {
      setToken(''); // no auth required
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [apis]);

  const prevApisRef = useRef();
  const prevFiltersRef = useRef();
  useEffect(() => {
    const apisString = JSON.stringify(apis);
    const filtersString = JSON.stringify(filtersForBody);
    const prevApisString = prevApisRef.current;
    const prevFiltersString = prevFiltersRef.current;

    // Only run if apis or filtersForBody actually changed
    if (
      token !== null &&
      (apisString !== prevApisString || filtersString !== prevFiltersString)
    ) {
      prevApisRef.current = apisString;
      prevFiltersRef.current = filtersString;
      const fetchAndPoll = async () => {
        try {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          abortControllerRef.current = new AbortController();
          const signal = abortControllerRef.current.signal;
          const requests = apis.map((api) => {
            const { url, method = 'get', headers = {}, baseUrl, isAuthApi } = api;
            if (isAuthApi) return null;
            const axiosInstance = axios.create({ baseURL: baseUrl });
            const config = {
              ...generateConfig(headers, token),
              signal,
            };
            if (method === 'post') {
              return axiosInstance.post(url, filtersForBody, config);
            } else {
              return axiosInstance.get(url, config);
            }
          });
          const results = await Promise.all(requests.filter(Boolean));
          setResponse(results.map((res) => res.data));
        } catch (err) {
          if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError' || err.message === 'canceled') {
            console.warn('Request canceled:', err.message);
          } else {
            console.error('Fetch error:', err.message);
            setError(err);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchAndPoll(); // Initial fetch

      if (pollingInterval && typeof pollingInterval === 'number') {
        pollingRef.current = setInterval(fetchAndPoll, pollingInterval);
      }
    }
  }, [token, apis, pollingInterval, filtersForBody]);

  return { response, error, loading };
};
*/
