import React, { useState } from 'react';
import { useThemeTokens } from '../contexts/ThemeProvider';

export default function ThemePanel() {
  const { tokens, setTokens } = useThemeTokens();
  const defaults = {
    primary: '#4f46e5',
    primaryText: '#ffffff',
    surface: '#ffffff',
    border: '#e2e8f0',
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '16px'
  };
  const [primary, setPrimary] = useState(tokens.primary || defaults.primary);
  const [primaryText, setPrimaryText] = useState(tokens.primaryText || defaults.primaryText);
  const [surface, setSurface] = useState(tokens.surface || defaults.surface);
  const [border, setBorder] = useState(tokens.border || defaults.border);
  const [radiusMd, setRadiusMd] = useState(tokens.radiusMd || defaults.radiusMd);

  const save = () => {
    const next = { ...tokens, primary, primaryText, surface, border, radiusMd };
    setTokens(next);
    try { localStorage.setItem('themeTokens', JSON.stringify(next)); } catch {}
  };

  const reset = () => {
    setPrimary(defaults.primary);
    setPrimaryText(defaults.primaryText);
    setSurface(defaults.surface);
    setBorder(defaults.border);
    setRadiusMd(defaults.radiusMd);
    const next = { ...defaults };
    setTokens(next);
    try { localStorage.setItem('themeTokens', JSON.stringify(next)); } catch {}
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm space-y-3" role="form" aria-label="Theme tokens editor">
      <h3 className="font-semibold text-sm">Theme Tokens</h3>
      <div className="flex items-center gap-2">
        <label className="text-xs w-16">Primary</label>
        <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} />
        <span className="text-[10px] font-mono">{primary}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs w-16">PrimaryText</label>
        <input type="color" value={primaryText} onChange={e => setPrimaryText(e.target.value)} />
        <span className="text-[10px] font-mono">{primaryText}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs w-16">Surface</label>
        <input type="color" value={surface} onChange={e => setSurface(e.target.value)} />
        <span className="text-[10px] font-mono">{surface}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs w-16">Border</label>
        <input type="color" value={border} onChange={e => setBorder(e.target.value)} />
        <span className="text-[10px] font-mono">{border}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs w-16">RadiusMd</label>
        <input type="text" value={radiusMd} onChange={e => setRadiusMd(e.target.value)} className="w-20 border px-1 py-0.5 text-[10px]" />
      </div>
      <div className="p-2 border rounded" aria-label="Preview" style={{ background: surface, color: primaryText, border: `1px solid ${border}`, borderRadius: radiusMd }}>
        <button style={{ background: primary, color: primaryText, borderRadius: radiusMd }} className="px-2 py-1 text-[10px]">Preview Button</button>
      </div>
      <button onClick={save} className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
      <button onClick={reset} className="text-xs px-3 py-1 rounded bg-gray-300 ml-2 hover:bg-gray-200">Reset</button>
    </div>
  );
}
