import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// Reduced client transform scope: only 'pick' (single path) and 'map' (field projections) for presentation shaping.
function applyTransforms(data, transforms = []) {
  if (!transforms || !transforms.length) return data;
  let current = data;
  for (const t of transforms) {
    if (!t || !t.op) continue;
    if (t.op === 'pick') {
      current = t.path ? resolvePath(current, t.path) : current;
    } else if (t.op === 'map') {
      if (Array.isArray(current) && t.fields) {
        current = current.map(item => {
          const out = {};
          for (const [k, path] of Object.entries(t.fields)) {
            out[k] = resolvePath(item, path);
          }
            return out;
        });
      }
    }
  }
  return current;
}

function resolvePath(obj, path) {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export default function useDataSource(descriptor) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!descriptor);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const pollingRef = useRef(null);
  const socketRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!descriptor) return;
    const { transport = 'rest' } = descriptor;
    setLoading(true);
    setError(null);

    if (transport === 'socket') {
      const { socket = {} } = descriptor;
      const socketUrl = socket.url;
      if (!socketUrl) {
        setError(new Error('Socket URL missing'));
        setLoading(false);
        return;
      }
      const event = socket.event || 'data';
      const s = io(socketUrl, { autoConnect: true });
      socketRef.current = s;
      s.on(event, (payload) => {
        const transformed = applyTransforms(payload, descriptor.transform);
        setData(transformed);
        setSource('socket');
        setLoading(false);
      });
      s.on('connect_error', (e) => {
        setError(e);
        setLoading(false);
      });
      return () => {
        s.disconnect();
      };
    }

    // REST path
    const fetchOnce = async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
  const { method = 'get', url, baseUrl = '', params, body, headers = {}, auth } = descriptor;
        if (!url) throw new Error('Descriptor missing url');
        let tokenHeader = {};
        if (auth?.strategy === 'bearer' && auth.token) {
          tokenHeader = { Authorization: `Bearer ${auth.token}` };
        }
  // Respect empty string baseUrl to leverage CRA dev proxy (relative URLs)
  const resolvedBase = baseUrl === '' ? '' : (baseUrl || process.env.REACT_APP_API_BASE || 'http://localhost:3002');
  const instance = axios.create({ baseURL: resolvedBase });
        const axiosConfig = { params, headers: { 'Content-Type': 'application/json', ...tokenHeader, ...headers }, signal: abortRef.current.signal };
        let resp;
        if (method.toLowerCase() === 'post') resp = await instance.post(url, body || {}, axiosConfig);
        else resp = await instance.get(url, axiosConfig);
        const transformed = applyTransforms(resp.data, descriptor.transform);
        setData(transformed);
        setSource('rest');
        setLoading(false);
      } catch (e) {
        if (e.name === 'CanceledError') return;
        setError(e);
        setLoading(false);
      }
    };
    fetchOnce();
    if (descriptor.pollingMs) {
      pollingRef.current = setInterval(fetchOnce, descriptor.pollingMs);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [JSON.stringify(descriptor)]); // descriptor as a whole

  return { data, loading, error, source };
}
