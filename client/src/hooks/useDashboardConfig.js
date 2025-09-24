import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';

export function useDashboardConfig(name) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        const { data } = await apiRequest(`/dashboard-config/name/${encodeURIComponent(name)}`, { method: 'GET', retries: 1, timeoutMs: 8000, meta: { kind: 'dashboardConfig', name } });
        if (!cancelled) setConfig(data);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [name]);

  return { config, loading, error };
}

export default useDashboardConfig;
