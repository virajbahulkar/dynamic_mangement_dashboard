import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { apiRequest } from '../lib/apiClient';
import FormFromSchema from '../components/Inspector/FormFromSchema';
import PageRenderer from '../components/PageRenderer.jsx';

const ReactGridLayout = WidthProvider(RGL);

export default function Builder() {
  const [components, setComponents] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(null); // selected catalog entry
  const [propsDraft, setPropsDraft] = React.useState({});
  const [tiles, setTiles] = React.useState([]); // [{id, type, props, span, layout}]
  const [activeTileId, setActiveTileId] = React.useState(null);
  const [inspectorValid, setInspectorValid] = React.useState(true);
  const [pageId, setPageId] = React.useState('draft');
  const [pagesList, setPagesList] = React.useState([]); // list of saved page ids
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightTab, setRightTab] = React.useState('components'); // 'components' | 'inspector'
  const [compSearch, setCompSearch] = React.useState('');
  const [snap, setSnap] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState([]); // multi-select selection
  const [guides, setGuides] = React.useState({ v: [] }); // alignment guides
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [gridSettings, setGridSettings] = React.useState({ rowHeight: 24, marginX: 8, marginY: 8 });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await apiRequest('/registry/components', { retries: 1 });
        if (!cancelled) setComponents(data.components || []);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load list of saved pages for a Pages drawer (left)
  const refreshPagesList = React.useCallback(async () => {
    try {
      const { data } = await apiRequest('/pages');
      setPagesList(Array.isArray(data?.ids) ? data.ids : []);
    } catch (e) {
      // ignore
    }
  }, []);
  React.useEffect(() => { refreshPagesList(); }, [refreshPagesList]);

  const onSelect = (c) => {
    setActiveTileId(null);
    setSelected(c);
    setPropsDraft(c.defaults || {});
  };

  const copyJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    if (navigator.clipboard) navigator.clipboard.writeText(json);
    alert('JSON copied to clipboard');
  };

  const addToCanvas = () => {
    if (!selected) return;
    const id = 'tile_' + Math.random().toString(36).slice(2, 8);
    const span = { base: 12, md: 6, lg: 4 };
    const layout = { i: id, x: 0, y: Infinity, w: 4, h: 4, minW: 2, maxW: 12, minH: 2 };
    const tile = { id, type: selected.type, props: { ...(propsDraft || {}) }, span, layout };
    setTiles((prev) => [...prev, tile]);
    setActiveTileId(id);
    setSelectedIds([id]);
    setRightTab('inspector');
  };

  const selectTile = (t, evt) => {
    if (evt?.shiftKey) {
      setSelectedIds((prev) => prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]);
    } else {
      setSelectedIds([t.id]);
    }
    setActiveTileId(t.id);
    const meta = components.find((c) => c.type === t.type) || null;
    setSelected(meta);
    setPropsDraft({ ...(t.props || {}) });
  };

  const updateActiveTileProps = (nextProps) => {
    setPropsDraft(nextProps);
    setTiles((prev) => prev.map((t) => (t.id === activeTileId ? { ...t, props: nextProps } : t)));
  };

  const onLayoutChange = (layout) => {
    setTiles((prev) => prev.map((t) => {
      const l = layout.find((x) => x.i === t.id);
      return l ? { ...t, layout: l, span: { base: 12, md: Math.min(12, Math.max(1, l.w)), lg: Math.min(12, Math.max(1, l.w)) } } : t;
    }));
    setGuides({ v: [] });
  };

  const deleteTile = (tileId) => {
    setTiles((prev) => prev.filter((t) => t.id !== tileId));
    if (activeTileId === tileId) {
      setActiveTileId(null);
    }
  };

  const exportPage = () => {
    const page = { id: pageId, tiles };
    copyJson(page);
  };

  const importPage = async () => {
    const raw = prompt('Paste page JSON');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.tiles)) setTiles(parsed.tiles);
      else alert('Invalid page JSON: missing tiles array');
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  const activeTile = tiles.find((t) => t.id === activeTileId) || null;
  const inspectorSchema = activeTile ? selected?.propsSchema : selected?.propsSchema;
  const inspectorValue = activeTile ? activeTile.props : propsDraft;
  const onInspectorChange = activeTile ? updateActiveTileProps : setPropsDraft;

  const baseLayout = React.useMemo(() => tiles.map((t, idx) => ({
    i: t.id,
    x: t.layout?.x ?? ((idx % 3) * 4),
    y: t.layout?.y ?? Math.floor(idx / 3) * 4,
    w: t.layout?.w ?? 4,
    h: t.layout?.h ?? 4,
    minW: 2,
    minH: 2,
    maxW: 12,
  })), [tiles]);

  const previewPlacements = React.useMemo(() => tiles.map((t, idx) => ({
    id: t.id,
    slotPath: t.id,
    type: t.type,
    parameters: { ...t.props, span: { base: 12, md: Math.min(12, Math.max(1, (t.layout?.w ?? 4))) } },
    title: t.type,
  })), [tiles]);

  const savePage = async () => {
    try {
      await apiRequest(`/pages/${encodeURIComponent(pageId)}`, { method: 'POST', body: { id: pageId, tiles } });
      alert('Page saved');
    } catch (e) {
      alert('Save failed: ' + e.message);
    }
  };

  const loadPage = async () => {
    try {
      const { data } = await apiRequest(`/pages/${encodeURIComponent(pageId)}`);
      if (data && Array.isArray(data.tiles)) setTiles(data.tiles);
      else alert('No page found or invalid payload');
    } catch (e) {
      alert('Load failed: ' + e.message);
    }
  };

  // Keyboard shortcuts: multi-select aware
  React.useEffect(() => {
    const onKey = (e) => {
      if (selectedIds.length === 0) return;
      // Delete selection
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setTiles((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
        setSelectedIds([]);
        setActiveTileId(null);
        return;
      }
      // Clone single selection
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D') && selectedIds.length === 1) {
        e.preventDefault();
        const orig = tiles.find((t) => t.id === selectedIds[0]);
        if (!orig) return;
        const l0 = { ...(orig.layout || { i: orig.id, x: 0, y: 0, w: 4, h: 4 }) };
        const id = 'tile_' + Math.random().toString(36).slice(2, 8);
        const newTile = { ...orig, id, layout: { ...l0, i: id, x: (l0.x || 0) + 1, y: (l0.y || 0) + 1 } };
        setTiles((prev) => [...prev, newTile]);
        setSelectedIds([id]);
        setActiveTileId(id);
        return;
      }
      const isArrow = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key);
      if (!isArrow) return;
      e.preventDefault();
      setTiles((prev) => prev.map((t) => {
        if (!selectedIds.includes(t.id)) return t;
        const l = { ...(t.layout || { i: t.id, x: 0, y: 0, w: 4, h: 4 }) };
        if (e.altKey) {
          if (e.key === 'ArrowRight') l.w = Math.min(12, (l.w || 4) + 1);
          if (e.key === 'ArrowLeft') l.w = Math.max(1, (l.w || 4) - 1);
          if (e.key === 'ArrowDown') l.h = Math.max(1, (l.h || 4) + 1);
          if (e.key === 'ArrowUp') l.h = Math.max(1, (l.h || 4) - 1);
        } else {
          if (e.key === 'ArrowLeft') l.x = Math.max(0, (l.x || 0) - 1);
          if (e.key === 'ArrowRight') l.x = Math.max(0, (l.x || 0) + 1);
          if (e.key === 'ArrowUp') l.y = Math.max(0, (l.y || 0) - 1);
          if (e.key === 'ArrowDown') l.y = Math.max(0, (l.y || 0) + 1);
        }
        return { ...t, layout: l };
      }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIds, tiles]);

  // Alignment guides: compute vertical matches with moving item
  const computeVerticalGuides = React.useCallback((moving) => {
    if (!moving) return [];
    const v = new Set();
    tiles.forEach((t) => {
      if (t.id === moving.i) return;
      const l = t.layout || {};
      const edges = [l.x, (l.x||0)+(l.w||0)];
      edges.forEach((col) => {
        if (col === moving.x || col === (moving.x||0)+(moving.w||0)) v.add(col);
      });
    });
    return Array.from(v.values()).filter((n) => typeof n === 'number');
  }, [tiles]);

  const onDrag = (layout, oldItem, newItem) => { setGuides({ v: computeVerticalGuides(newItem) }); };
  const onDragStop = () => setGuides({ v: [] });
  const onResize = (layout, oldItem, newItem) => { setGuides({ v: computeVerticalGuides(newItem) }); };
  const onResizeStop = () => setGuides({ v: [] });

  // Filtered components for palette search
  const filteredComponents = React.useMemo(() => {
    const q = compSearch.trim().toLowerCase();
    if (!q) return components;
    return components.filter((c) =>
      [c.type, c.category, c.icon].filter(Boolean).some((s) => String(s).toLowerCase().includes(q))
    );
  }, [components, compSearch]);

  return (
    <>
    <div className="p-0 h-full min-h-[calc(100vh-80px)] grid grid-rows-[auto_1fr]">
      {/* Top toolbar */}
      <div className="px-4 py-2 border-b bg-white flex items-center gap-2">
        <button className="text-xs px-2 py-1 border rounded" onClick={() => setLeftOpen((v) => !v)}>
          {leftOpen ? 'Hide Pages' : 'Show Pages'}
        </button>
        <div className="flex items-center gap-2 ml-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Page ID" value={pageId} onChange={(e)=>setPageId(e.target.value)} />
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50" onClick={async ()=>{ await savePage(); await refreshPagesList(); }} disabled={!inspectorValid}>Save</button>
          <button className="px-3 py-1.5 bg-gray-600 text-white rounded" onClick={loadPage}>Load</button>
          <button className="px-3 py-1.5 bg-gray-200 rounded" onClick={exportPage}>Export</button>
          <button className="px-3 py-1.5 bg-gray-200 rounded" onClick={importPage}>Import</button>
          <label className="ml-3 text-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={snap} onChange={(e)=>setSnap(e.target.checked)} /> Snap to grid
          </label>
          <button className="ml-2 text-xs px-2 py-1 border rounded" onClick={()=>setSettingsOpen(true)}>Settings</button>
        </div>
        <div className="ml-auto text-xs text-gray-500">Arrows: move • Alt+Arrows: resize • Cmd/Ctrl+D: clone • Del: remove</div>
      </div>

      {/* Body: left drawer | center canvas | right sidebar */}
      <div className="grid grid-cols-12 gap-0">
        {/* Left pages/tree drawer */}
        <div className={`${leftOpen ? 'col-span-2 border-r' : 'hidden'} bg-white min-h-[calc(100vh-160px)] p-3`}> 
          <div className="text-xs font-semibold uppercase text-gray-600 mb-2">Pages</div>
          <div className="space-y-1">
            {pagesList.length === 0 && <div className="text-xs text-gray-400">No saved pages</div>}
            {pagesList.map((pid) => (
              <button key={pid} className={`w-full text-left px-2 py-1 rounded text-sm ${pageId===pid?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={()=>{ setPageId(pid); loadPage(); }}>
                {pid}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase text-gray-600 mb-2">Components</div>
            <ul className="text-sm space-y-1">
              {tiles.map((t) => (
                <li key={t.id}>
                  <button className={`w-full text-left px-2 py-1 rounded ${selectedIds.includes(t.id)?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={(e)=>selectTile(t, e)}>
                    {t.type} <span className="text-[10px] text-gray-400">({t.id})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center canvas */}
        <div className={`${leftOpen ? 'col-span-7' : 'col-span-9'} p-3`}>
          <h2 className="text-sm font-semibold mb-2 text-gray-600">Canvas</h2>
          <div className="relative rounded border bg-[length:24px_24px] bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)]">
            {/* Guides overlay */}
            {guides.v.length > 0 && (
              <div className="pointer-events-none absolute inset-0">
                {guides.v.map((col) => (
                  <div key={col} className="absolute top-0 bottom-0 border-l-2 border-red-400 opacity-60" style={{ left: `${(col/12)*100}%` }} />
                ))}
              </div>
            )}
            <ReactGridLayout
              className="layout"
              cols={12}
              rowHeight={snap ? gridSettings.rowHeight : Math.max(12, gridSettings.rowHeight - 8)}
              margin={[gridSettings.marginX, gridSettings.marginY]}
              containerPadding={[8,8]}
              onLayoutChange={onLayoutChange}
              onDrag={onDrag}
              onDragStop={onDragStop}
              onResize={onResize}
              onResizeStop={onResizeStop}
              isBounded
              compactType={null}
              preventCollision={false}
              draggableHandle=".drag-handle"
            >
              {tiles.map((t) => (
                <div key={t.id} data-grid={t.layout || { i:t.id, x:0, y:Infinity, w:4, h:4 }}
                     className={`border rounded bg-white shadow-sm ${selectedIds.includes(t.id)?'ring-2 ring-blue-500':''}`}
                     onClick={(e) => selectTile(t, e)}>
                  <div className="drag-handle flex items-center justify-between px-2 py-1 border-b cursor-move select-none">
                    <div className="text-xs font-medium truncate">{t.type}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">w{t.layout?.w||4}×h{t.layout?.h||4}</span>
                      <button className="text-[11px] text-red-600" onClick={(e) => { e.stopPropagation(); deleteTile(t.id); }}>Delete</button>
                    </div>
                  </div>
                  <div className="p-2">
                    <pre className="text-[11px] bg-gray-50 p-2 rounded overflow-auto">
                      {JSON.stringify(t.props, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </ReactGridLayout>
          </div>

          {/* Live preview below canvas */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2 text-gray-600">Live Preview</h2>
            <div className="border rounded p-3 bg-white">
              <PageRenderer placements={previewPlacements} />
            </div>
          </div>
        </div>

        {/* Right sidebar: Components / Inspector tabs */}
        <div className="col-span-3 border-l bg-white p-3 min-h-[calc(100vh-160px)]">
          <div className="flex items-center gap-2 mb-3 border-b">
            <button className={`px-3 py-1.5 text-sm ${rightTab==='components'?'border-b-2 border-blue-600 font-semibold':''}`} onClick={()=>setRightTab('components')}>Components</button>
            <button className={`px-3 py-1.5 text-sm ${rightTab==='inspector'?'border-b-2 border-blue-600 font-semibold':''}`} onClick={()=>setRightTab('inspector')}>Inspector</button>
          </div>
          {rightTab === 'components' && (
            <div>
              {error && <div className="p-2 text-sm text-red-600">Error: {error.message}</div>}
              {loading ? (
                <div className="text-sm text-gray-500">Loading registry…</div>
              ) : (
                <>
                  <input className="border rounded px-2 py-1 text-sm w-full mb-2" placeholder="Search components" value={compSearch} onChange={(e)=>setCompSearch(e.target.value)} />
                  <ul className="grid grid-cols-2 gap-2">
                    {filteredComponents.map((c, i) => (
                      <li key={i} className={`border rounded p-2 hover:shadow-sm cursor-pointer ${selected?.type===c.type && !activeTile ? 'ring-2 ring-blue-500':''}`}
                          onClick={() => onSelect(c)}>
                        <div className="text-[10px] uppercase text-gray-500">{c.category}</div>
                        <div className="text-sm font-medium truncate">{c.type}</div>
                        <div className="text-[10px] text-gray-500">v{c.version}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <button className="w-full px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-50" onClick={addToCanvas} disabled={!selected || !inspectorValid}>Add to Canvas</button>
                  </div>
                </>
              )}
            </div>
          )}
          {rightTab === 'inspector' && (
            <div>
              <div className="text-sm text-gray-600 mb-2">{activeTile ? `${activeTile.type} (tile)` : selected ? selected.type : 'No selection'}</div>
              {selected ? (
                <>
                  <FormFromSchema schema={inspectorSchema} value={inspectorValue} onChange={onInspectorChange} onValidityChange={setInspectorValid} />
                  <div className="flex items-center gap-2 mt-2">
                    {!activeTile && (
                      <button className="px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-50" onClick={addToCanvas} disabled={!inspectorValid}>Add to Canvas</button>
                    )}
                    <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => copyJson(activeTile ? activeTile : { type: selected.type, props: propsDraft })}>Copy JSON</button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">Select a component to edit its properties</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Settings Drawer */}
    {settingsOpen && (
      <div className="fixed inset-0 bg-black/20 flex justify-end" onClick={()=>setSettingsOpen(false)}>
        <div className="w-80 bg-white h-full p-4" onClick={(e)=>e.stopPropagation()}>
          <div className="text-lg font-semibold mb-3">Canvas Settings</div>
          <label className="block mb-3 text-sm">
            Row height
            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={gridSettings.rowHeight} onChange={(e)=>setGridSettings(s=>({...s, rowHeight: Math.max(8, Number(e.target.value)||24)}))} />
          </label>
          <label className="block mb-3 text-sm">
            Margin X
            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={gridSettings.marginX} onChange={(e)=>setGridSettings(s=>({...s, marginX: Math.max(0, Number(e.target.value)||8)}))} />
          </label>
          <label className="block mb-3 text-sm">
            Margin Y
            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={gridSettings.marginY} onChange={(e)=>setGridSettings(s=>({...s, marginY: Math.max(0, Number(e.target.value)||8)}))} />
          </label>
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>setSettingsOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
