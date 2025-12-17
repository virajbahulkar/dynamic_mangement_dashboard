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
  const [showJson, setShowJson] = React.useState(false);

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
  };

  const selectTile = (t) => {
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
  };

  const deleteTile = (tileId) => {
    console.log('Deleting tile', tileId);
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

  return (
    <div className="p-4 grid grid-cols-12 gap-4">
      <div className="col-span-12 flex items-center gap-2">
        <input className="border rounded px-2 py-1 text-sm" placeholder="Page ID" value={pageId} onChange={(e)=>setPageId(e.target.value)} />
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={savePage} disabled={!inspectorValid}>Save</button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded" onClick={loadPage}>Load</button>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={exportPage}>Export Page JSON</button>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={importPage}>Import Page JSON</button>
      </div>

      {/* Canvas */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Canvas (drag + resize)</h2>
          <button className="px-3 py-1 bg-gray-200 rounded text-sm" onClick={() => setShowJson(!showJson)}>
            {showJson ? 'Hide JSON' : 'Show JSON'}
          </button>
        </div>
        <ReactGridLayout
          className="layout"
          cols={12}
          rowHeight={24}
          margin={[12,12]}
          onLayoutChange={onLayoutChange}
          isBounded
          draggableCancel="button"
          resizableCancel="button"
        >
          {tiles.map((t) => (
            <div key={t.id} data-grid={t.layout || { i:t.id, x:0, y:Infinity, w:4, h:4 }}
                 className={`border rounded p-2 bg-white ${activeTileId===t.id?'ring-2 ring-blue-500':''}`}
                 onClick={() => selectTile(t)}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{t.type}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">w{t.layout?.w||4}×h{t.layout?.h||4}</span>
                  <button type="button" className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200" onClick={(e) => { e.stopPropagation(); deleteTile(t.id); }}>Delete</button>
                </div>
              </div>
              {showJson && (
                <pre className="text-[11px] bg-gray-50 p-2 rounded overflow-auto">
                  {JSON.stringify(t.props, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </ReactGridLayout>
      </div>

      {/* Palette */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <h1 className="text-xl font-bold mb-2">Component Palette</h1>
        {error && <div className="p-2 text-sm text-red-600">Error: {error.message}</div>}
        {loading ? (
          <div className="text-sm text-gray-500">Loading registry…</div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {components.map((c, i) => (
              <li key={i} className={`border rounded p-3 hover:shadow-sm cursor-pointer ${selected?.type===c.type && !activeTile ? 'ring-2 ring-blue-500':''}`}
                  onClick={() => onSelect(c)}>
                <div className="text-xs uppercase text-gray-500">{c.category}</div>
                <div className="font-medium">{c.type}</div>
                <div className="text-xs text-gray-500">v{c.version}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Inspector */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <h2 className="text-lg font-semibold mb-2">Inspector</h2>
        {!selected ? (
          <div className="text-sm text-gray-500">Select a component to edit its properties</div>
        ) : (
          <div>
            <div className="text-sm text-gray-600 mb-2">{activeTile ? `${activeTile.type} (tile)` : selected.type}</div>
            <FormFromSchema schema={inspectorSchema} value={inspectorValue} onChange={onInspectorChange} onValidityChange={setInspectorValid} />
            <div className="flex items-center gap-2 mt-2">
              {!activeTile && (
                <button className="px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-50" onClick={addToCanvas} disabled={!inspectorValid}>Add to Canvas</button>
              )}
              <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => copyJson(activeTile ? activeTile : { type: selected.type, props: propsDraft })}>Copy JSON</button>
            </div>
          </div>
        )}
      </div>

      {/* Live preview */}
      <div className="col-span-12">
        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <div className="border rounded p-3 bg-white">
          <PageRenderer placements={previewPlacements} />
        </div>
      </div>
    </div>
  );
}
