import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { apiRequest } from '../lib/apiClient';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const defaults = {
        primary: '#4f46e5',
        primaryText: '#ffffff',
        surface: '#ffffff',
        surfaceAlt: '#f5f7fa',
        border: '#e2e8f0',
        radiusSm: '4px',
        radiusMd: '8px',
        radiusLg: '16px'
      };
      try {
        let serverTokens = {};
        try {
          const res = await apiRequest('/config/theme', { method: 'GET', retries: 1, timeoutMs: 5000, meta: { kind: 'themeFetch' } });
          if (res && res.tokens && typeof res.tokens === 'object') serverTokens = res.tokens;
        } catch (inner) {
          // swallow server errors; fallback to defaults + local overrides
        }
        const local = (() => { try { return JSON.parse(localStorage.getItem('themeTokens')||'{}'); } catch { return {}; } })();
        const merged = { ...defaults, ...serverTokens, ...local };
        if (!cancelled) setTokens(merged);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([k,v]) => {
      root.style.setProperty(`--app-${k}`, v);
    });
  }, [tokens]);

  const value = useMemo(() => ({ tokens, setTokens, loading, error }), [tokens, loading, error]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeTokens() {
  return useContext(ThemeContext);
}
