import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';

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
        const path = `/meta/apps/${encodeURIComponent(appId)}/pages/${encodeURIComponent(slug)}?hydrate=1&include=assets`;
        const { data: payload } = await apiRequest(path, { retries: 2 });
        if (!cancelled) setData(payload);
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
  const assets = data?.assets || [];
  const placementsRaw = page?.placements || [];

  const componentsMap = components.reduce((acc, c) => { acc[c._id] = c; return acc; }, {});
  const assetsMap = assets.reduce((acc, a) => { acc[a._id] = a; return acc; }, {});

  // Build slotPath -> componentId map from page.components for easier placement resolution
  const slotToComp = (page?.components || []).reduce((acc, c) => {
    if (c && c.slotPath && (c.ref || (c.ref && c.ref._id))) {
      acc[c.slotPath] = typeof c.ref === 'string' ? c.ref : c.ref._id;
    }
    return acc;
  }, {});
  const placements = placementsRaw.map(p => ({
    ...p,
    componentId: p.componentId || slotToComp[p.slotPath],
  }));

  return { data, page, layout, components, assets, placements, componentsMap, assetsMap, loading, error };
}
