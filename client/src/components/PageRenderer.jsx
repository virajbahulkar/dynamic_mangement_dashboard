import React, { Suspense, useMemo } from 'react';
import ChartSkeleton from './skeletons/ChartSkeleton';
import TableSkeleton from './skeletons/TableSkeleton';
import SkeletonBox from './skeletons/SkeletonBox';
import { loadComponent, hasComponent } from '../registry/components';

function Fallback({ title }) {
  return <div style={{padding:8, border:'1px solid #ddd', fontSize:12}}>Loading {title || 'component'}...</div>;
}

function Missing({ type }) {
  return <div style={{padding:8, border:'1px solid #f99', background:'#fff5f5', color:'#900', fontSize:12}}>Missing component type: {type}</div>;
}

// placements: [{ assetId?, componentId?, type?, parameters?, slotPath?, title? }]
// assetsMap: id -> asset (with type, parameters)
// componentsMap: id -> component def
export default function PageRenderer({ placements = [], assetsMap = {}, componentsMap = {}, overrideParams = {}, loading=false }) {
  const enriched = useMemo(() => {
    return placements.map(p => {
      let type = p.type;
      let params = { ...(p.parameters || {}) };
      const slotId = (p.slotPath || p.id || p.componentId || Math.random().toString(36).slice(2)).toString().replace(/[^a-zA-Z0-9_-]+/g,'-');
      if (p.assetId && assetsMap[p.assetId]) {
        const asset = assetsMap[p.assetId];
        type = type || asset.type;
        params = { ...asset.parameters, ...params };
      }
      if (p.componentId && componentsMap[p.componentId]) {
        const comp = componentsMap[p.componentId];
          // If component definition stores a type or metadata, merge
          if (!type) type = comp.type || comp.kind;
        params = { ...comp.props, ...comp.parameters, ...params };
        // If no explicit data provided, attempt to use hydrated/transformed data
        if (params.data == null && Array.isArray(comp.transformedData)) {
          // For charts, build series from transformedData
          // Infer x/y names if absent by peeking first row
          let xf = params.xField || params.xname || params.x;
          let yf = params.yField || params.yname || params.y;
          const lf = params.legendField || params.seriesField || params.legend;
          if ((!xf || !yf) && Array.isArray(comp.transformedData) && comp.transformedData.length) {
            const keys = Object.keys(comp.transformedData[0] || {});
            if (!xf && keys[0]) xf = keys[0];
            if (!yf && keys[1]) yf = keys[1];
          }
          if (/^chart(\.|$)/.test(type) && xf && yf) {
            if (lf) {
              // Multi-series: group by legend field
              const groups = comp.transformedData.reduce((acc, row) => {
                const key = row[lf];
                if (!acc[key]) acc[key] = [];
                acc[key].push(row);
                return acc;
              }, {});
              const series = Object.entries(groups).map(([name, rows]) => ({ name, dataSource: rows, xName: xf, yName: yf }));
              params = { ...params, data: series };
            } else {
              // Single-series
              params = { ...params, data: [{ dataSource: comp.transformedData, xName: xf, yName: yf }] };
            }
          } else {
            // Non-chart components consume raw data
            params = { ...params, data: comp.transformedData };
          }
        }
        // For table components, if no content provided, synthesize from transformedData
        if ((type === 'table' || type === 'table.basic' || comp.kind === 'table') && !params.content && Array.isArray(comp.transformedData) && comp.transformedData.length) {
          const sample = comp.transformedData[0];
          const headings = Object.keys(sample).map(k => ({ field: k, headerText: (k.charAt(0).toUpperCase() + k.slice(1)).replace(/_/g,' ') }));
          params = {
            ...params,
            content: { tableData: { data: comp.transformedData, headings } }
          };
        }
      }
      // Apply runtime overrides (by slotPath or placement id)
      if (overrideParams[p.slotPath]) {
        params = { ...params, ...overrideParams[p.slotPath] };
      }
      // Normalize type: if it's a base kind, try mapping to registry key via variant
      let resolvedType = type;
      if (type && !hasComponent(type)) {
        if (type === 'table') resolvedType = 'table.basic';
        else if (type === 'chart') {
          const variant = params?.type || params?.variant || 'bar';
          const toCamel = (s) => String(s).replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());
          resolvedType = `chart.${toCamel(variant)}`;
        }
      }
      // Ensure id is set for components that rely on it for DOM element ids
      if (!params.id) params.id = slotId;
      return { ...p, resolvedType, resolvedParams: params };
    });
  }, [placements, assetsMap, componentsMap, overrideParams]);

  if (loading && (!enriched || enriched.length === 0)) {
    return (
      <div className="page-layout-grid" style={{ display:'grid', gap:16 }}>
        <SkeletonRow kind="chart" />
        <SkeletonRow kind="table" />
        <SkeletonRow kind="generic" />
      </div>
    );
  }

  return (
    <div className="page-layout-grid" style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(12,minmax(0,1fr))' }}>
      {enriched.map(p => <RenderPlacement key={p.slotPath || p.id} placement={p} />)}
    </div>
  );
}

function SkeletonRow({ kind }) {
  if (kind === 'chart') return <ChartSkeleton />;
  if (kind === 'table') return <TableSkeleton rows={6} />;
  return <SkeletonBox height={140} />;
}

function RenderPlacement({ placement }) {
  const { resolvedType, resolvedParams, title } = placement;
  const span = normalizeSpan(placement.span || placement.resolvedParams?.span);
  const className = spanToClasses(span);
  if (!resolvedType || !hasComponent(resolvedType)) {
    return <div className={className}><Missing type={resolvedType || 'unknown'} /></div>;
  }
  const Lazy = React.lazy(() => loadComponent(resolvedType).then(C => ({ default: C })));
  return (
    <div className={className}>
      <Suspense fallback={<ComponentSkeleton type={resolvedType} title={title} />}> 
        <Lazy {...resolvedParams} placement={placement} />
      </Suspense>
    </div>
  );
}

function ComponentSkeleton({ type, title }) {
  if (!type) return <SkeletonBox height={100} />;
  if (/table/i.test(type)) return <TableSkeleton rows={5} />;
  if (/chart|line|bar|pie|spark/i.test(type)) return <ChartSkeleton />;
  return <Fallback title={title || type} />;
}

function normalizeSpan(span) {
  if (!span) return { base:12, md:6, lg:4 };
  if (typeof span === 'number') return { base:12, md:span, lg:span };
  if (typeof span === 'string') {
    const n = Number(span);
    if (!isNaN(n)) return { base:12, md:n, lg:n };
  }
  // Expect object like { base, md, lg }
  return {
    base: span.base || 12,
    md: span.md || span.base || 6,
    lg: span.lg || span.md || 4,
  };
}

function clamp(x) { return Math.min(12, Math.max(1, x)); }
function spanToClasses(span) {
  const b = clamp(span.base); const m = clamp(span.md); const l = clamp(span.lg);
  // Tailwind style utility fallbacks; if not using tailwind dynamic classes may need safelist
  return `col-span-12 md:col-span-${m} lg:col-span-${l}`;
}
