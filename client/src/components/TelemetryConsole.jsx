import React, { useEffect, useState } from 'react';
import { registerApiTelemetry } from '../lib/apiClient';

export default function TelemetryConsole() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const unsubscribe = registerApiTelemetry(evt => {
      setEvents(prev => [evt, ...prev.slice(0,199)]);
    });
    return unsubscribe;
  }, []);
  return (
    <div className="fixed bottom-2 right-2 w-80 max-h-64 overflow-auto bg-black/80 text-green-200 text-[10px] font-mono p-2 rounded shadow-lg" aria-label="API telemetry console">
      <div className="font-bold text-xs mb-1">Telemetry ({events.length})</div>
      {events.map((e,i) => (
        <div key={i} className="border-b border-white/10 py-0.5">
          <span className="text-white">{e.method}</span> {e.path} <span className={e.ok? 'text-green-400':'text-red-400'}>{e.status}</span> {Math.round(e.durationMs)}ms r{e.retries}
        </div>
      ))}
      {!events.length && <div className="italic">No events yet.</div>}
    </div>
  );
}
