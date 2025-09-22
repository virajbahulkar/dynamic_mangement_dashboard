import { useEffect, useState } from 'react';

export default function useHydratedPage(appId, slug, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !appId || !slug) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const base = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
        const urlPath = `/meta/apps/${encodeURIComponent(appId)}/pages/${encodeURIComponent(slug)}?hydrate=1`;
        const fullUrl = base ? `${base}${urlPath}` : urlPath;
        const res = await fetch(fullUrl, { headers: { Accept: 'application/json' } });
        const ct = res.headers.get('content-type') || '';
        if (!res.ok) {
          let bodyText = '';
          try { bodyText = await res.text(); } catch (_) { /* ignore */ }
          throw new Error(`Hydrated page fetch failed (${res.status}) ${bodyText.slice(0,200)}`);
        }
        if (!ct.includes('application/json')) {
          const text = await res.text();
            throw new Error(`Unexpected response (not JSON). First chars: ${text.slice(0,120)}`);
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appId, slug, enabled]);

  const page = data?.page;
  const layout = data?.layout;
  const components = data?.components || [];

  // Build a map of slotPath -> component for quick lookup if layout provides slots
  const componentMap = components.reduce((acc, c) => {
    // Expect slotPath stored in page.components array
    const slotEntry = page?.components?.find?.((pc) => pc.ref === c._id || pc.ref?._id === c._id);
    if (slotEntry && slotEntry.slotPath) acc[slotEntry.slotPath] = c;
    return acc;
  }, {});

  return { data, page, layout, components, componentMap, loading, error };
}
