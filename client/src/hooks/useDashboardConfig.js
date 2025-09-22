import { useEffect, useState } from 'react';

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
        const res = await fetch(`/dashboard-config/name/${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error(`Failed to fetch config ${name}`);
        const json = await res.json();
        if (!cancelled) setConfig(json);
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
