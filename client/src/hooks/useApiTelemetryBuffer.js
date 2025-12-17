import { useEffect, useRef } from 'react';
import { registerApiTelemetry, apiRequest } from '../lib/apiClient';

// Buffers API telemetry events and optionally POSTs to /metrics endpoint.
export default function useApiTelemetryBuffer({ flushIntervalMs = 15000, maxBuffer = 50, post = true } = {}) {
  const bufferRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const unregister = registerApiTelemetry(evt => {
      bufferRef.current.push({ ...evt, ts: Date.now() });
      if (bufferRef.current.length >= maxBuffer) flush();
    });

    function flush(sendBeaconPossible = false) {
      if (!post || bufferRef.current.length === 0) return;
      const payload = bufferRef.current.splice(0, bufferRef.current.length);
      // Try sendBeacon for page lifecycle events to improve delivery odds.
      if (sendBeaconPossible && navigator?.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify({ events: payload })], { type: 'application/json' });
          const ok = navigator.sendBeacon('/metrics', blob);
          if (ok) return; // success
        } catch {/* fallback to fetch */}
      }
      apiRequest('/metrics', {
        method: 'POST',
        body: { events: payload },
        retries: 0,
        timeoutMs: 4000,
        meta: { kind: 'telemetryFlush', count: payload.length },
      }).catch(() => {/* swallow */});
    }

    timerRef.current = setInterval(() => flush(), flushIntervalMs);

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') flush(true);
    };
    const unloadHandler = () => flush(true);
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('pagehide', unloadHandler);
    window.addEventListener('beforeunload', unloadHandler);

    return () => {
      unregister();
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('pagehide', unloadHandler);
      window.removeEventListener('beforeunload', unloadHandler);
      if (bufferRef.current.length) {
        try { flush(true); } catch {/* ignore */}
      }
    };
  }, [flushIntervalMs, maxBuffer, post]);
}
