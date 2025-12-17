import { useEffect, useState } from 'react';

export default function usePageLayout(appId, pageSlug, enabled = true) {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !appId || !pageSlug) return;
    let cancelled = false;
    async function fetchLayout() {
      try {
        setLoading(true);
        const res = await fetch(`/dashboard-config/apps/${appId}/pages/${pageSlug}`);
        if (!res.ok) throw new Error(`Failed to fetch page layout ${pageSlug}`);
        const json = await res.json();
        if (!cancelled) setLayout(json);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchLayout();
    return () => { cancelled = true; };
  }, [appId, pageSlug, enabled]);

  return { layout, loading, error };
}
