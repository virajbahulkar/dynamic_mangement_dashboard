// Lightweight fetch wrapper with correlation + api key + retry

function genCorrelation() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'cid-' + Math.random().toString(16).slice(2, 10);
}

const telemetrySinks = [];
export function registerApiTelemetry(fn) {
  if (typeof fn === 'function') telemetrySinks.push(fn);
  return () => {
    const idx = telemetrySinks.indexOf(fn);
    if (idx >= 0) telemetrySinks.splice(idx,1);
  };
}

export async function apiRequest(path, { method='GET', headers={}, body, retries=1, timeoutMs=12000, correlationId, apiKey, meta } = {}) {
  const cid = correlationId || genCorrelation();
  const finalHeaders = {
    Accept: 'application/json',
    'Content-Type': body ? 'application/json' : 'text/plain',
    'x-correlation-id': cid,
    ...(apiKey || process.env.REACT_APP_API_KEY ? { 'x-api-key': apiKey || process.env.REACT_APP_API_KEY } : {}),
    ...headers,
  };
  const rawBase = (process.env.REACT_APP_API_BASE || '');
  let base = rawBase.replace(/\/$/, '');
  // In development, prefer the CRA dev proxy to avoid CORS
  if (typeof window !== 'undefined' && (process.env.NODE_ENV || 'development') === 'development') {
    try {
      if (rawBase) {
        const baseURL = new URL(rawBase);
        if (baseURL.origin !== window.location.origin) {
          base = '';
        }
      }
    } catch {}
  }
  const url = base ? base + path : path;

  let attempt = 0;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = performance.now ? performance.now() : Date.now();
  try {
    while (true) {
      try {
        const res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
        const ct = res.headers.get('content-type') || '';
        let payload = null;
        if (ct.includes('application/json')) payload = await res.json(); else payload = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} :: ${typeof payload === 'string' ? payload.slice(0,200) : ''}`);
        const endedAt = performance.now ? performance.now() : Date.now();
        const durationMs = endedAt - startedAt;
        telemetrySinks.forEach(fn => {
          try { fn({ type:'api', path, method, status: res.status, durationMs, correlationId: cid, ok:true, retries: attempt, meta }); } catch {}
        });
        return { data: payload, correlationId: cid, status: res.status, durationMs };
      } catch (e) {
        if (e.name === 'AbortError') throw new Error(`Request timeout after ${timeoutMs}ms`);
        attempt++;
        if (attempt > retries) throw e;
        // Exponential backoff with jitter
        const backoff = Math.min(500 * Math.pow(2, attempt-1), 2000) + Math.random()*200;
        await new Promise(r => setTimeout(r, backoff));
      }
    }
  } finally {
    clearTimeout(timer);
    // If failed (thrown), surface telemetry here
    if (attempt > retries) {
      const endedAt = performance.now ? performance.now() : Date.now();
      const durationMs = endedAt - startedAt;
      telemetrySinks.forEach(fn => {
        try { fn({ type:'api', path, method, status: 'error', durationMs, correlationId: cid, ok:false, retries: attempt, meta }); } catch {}
      });
    }
  }
}
