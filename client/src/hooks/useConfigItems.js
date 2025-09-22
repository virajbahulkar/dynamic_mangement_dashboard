import { useEffect, useState } from 'react';

export default function useConfigItems(appId, category, enabled = true) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(!!enabled);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!enabled || !appId || !category) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const base = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
        const path = `/meta/apps/${encodeURIComponent(appId)}/config/${encodeURIComponent(category)}`;
        const url = base ? base + path : path;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Config fetch failed ${res.status}`);
        const json = await res.json();
        if (!cancelled) setItems(json.items || []);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appId, category, enabled]);
  return { items, loading, error };
}
