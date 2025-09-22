import React from 'react';
import useHydratedPage from '../hooks/useHydratedPage';
import { resolveComponent } from './componentRegistry';

export default function HydratedDashboard({ appId = 'default', slug = 'management-dashboard' }) {
  const { layout, page, components, loading, error } = useHydratedPage(appId, slug, true);

  if (loading) return <div className="text-xs p-2">Loading dashboard...</div>;
  if (error) return <div className="text-xs p-2 text-red-500">Error: {error.message}</div>;
  if (!layout || !page) return <div className="text-xs p-2">No layout found.</div>;

  const structure = layout.structure || {}; // { tabs: [ { rows: [ { quadrants: [ { slot } ] } ] } ] }
  const tabs = structure.tabs || [];

  // Build quick lookup id->component
  const compBySlot = {};
  (page.components || []).forEach(c => {
    const comp = components.find(h => h._id === c.ref || h._id === (c.ref && c.ref._id));
    if (comp) compBySlot[c.slotPath] = comp;
  });

  return (
    <div className="flex flex-col gap-4">
      {tabs.map((tab, tIdx) => (
        <div key={tIdx} className="flex flex-col gap-4">
          {tab.rows?.map((row, rIdx) => (
            <div key={rIdx} className="grid gap-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
              {row.quadrants?.map((q, qIdx) => {
                const slotKey = `${tIdx}:${rIdx}:${qIdx}`;
                const comp = compBySlot[slotKey];
                if (!comp) {
                  return <div key={qIdx} className="col-span-12 border p-2 text-xs italic">Empty slot {slotKey}</div>;
                }
                const Renderer = resolveComponent(comp.kind);
                // For now span rules: number (1-12) or 'full'
                const span = q.span === 'full' ? 12 : (Number(q.span) || 4);
                return (
                  <div key={qIdx} className={`col-span-${span} border rounded bg-white`}> 
                    <Renderer component={comp} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
