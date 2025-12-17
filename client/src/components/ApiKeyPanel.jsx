import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';

export default function ApiKeyPanel() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState(null); // null|ok|error|checking
  const [message, setMessage] = useState('');

  useEffect(() => {
    try { const stored = localStorage.getItem('x_api_key'); if (stored) setApiKey(stored); } catch {}
  }, []);

  const save = () => {
    try { localStorage.setItem('x_api_key', apiKey); } catch {}
    ping();
  };

  const ping = async () => {
    if (!apiKey) { setStatus('error'); setMessage('Enter key first'); return; }
    setStatus('checking'); setMessage('');
    try {
      const { status: s } = await apiRequest('/health/ready', { apiKey, retries: 0, timeoutMs: 4000 });
      if (s === 200) { setStatus('ok'); setMessage('Valid'); persistStatus('ok'); }
      else { setStatus('error'); setMessage('Unexpected status '+s); persistStatus('error'); }
    } catch (e) {
      setStatus('error'); setMessage(e.message); persistStatus('error');
    }
  };

  function persistStatus(st) {
    try { localStorage.setItem('api_key_status', st); } catch {}
    window.dispatchEvent(new CustomEvent('api-key-status', { detail: { status: st } }));
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm space-y-2" aria-label="API key settings">
      <h3 className="font-semibold text-sm">API Key</h3>
      <input
        aria-label="API key input"
        type="password"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        className="w-full border px-2 py-1 rounded text-xs"
        placeholder="Enter API key"
      />
      <div className="flex gap-2">
        <button onClick={save} className="text-xs px-2 py-1 rounded bg-blue-600 text-white">Save & Test</button>
        <button onClick={ping} className="text-xs px-2 py-1 rounded bg-gray-300">Test</button>
      </div>
      {status && (
        <div className={`text-[10px] ${status==='ok'?'text-green-600':status==='checking'?'text-yellow-600':'text-red-600'}`}>{status==='checking'?'Checking...':message}</div>
      )}
    </div>
  );
}
