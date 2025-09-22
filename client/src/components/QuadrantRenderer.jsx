import React from 'react';
import useDataSource from '../hooks/useDataSource';

// Simple placeholder renderers; real ones would import existing chart/table components.
function TableView({ title, data }) {
  return (
    <div className="p-2 border rounded bg-white shadow-sm">
      <h4 className="font-semibold mb-2">{title}</h4>
      <pre className="text-xs overflow-auto max-h-60">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function ChartView({ title, data }) {
  return (
    <div className="p-2 border rounded bg-white shadow-sm">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="text-xs">Chart data points: {Array.isArray(data) ? data.length : '-'}</div>
      <pre className="text-xs overflow-auto max-h-60">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function QuadrantRenderer({ quadrant }) {
  const { dataSource, type, title, preResolvedData, transformError } = quadrant || {};
  // If we have preResolvedData (server-side transform or static sample) we skip live fetching unless polling required.
  const shouldFetch = !!dataSource && !preResolvedData;
  const { data, loading, error, source } = useDataSource(shouldFetch ? dataSource : null);

  const finalData = preResolvedData || data;
  const dataLabel = preResolvedData ? 'server' : source;

  if (!dataSource && !preResolvedData) {
    return <div className="text-xs italic">No data available for {title}</div>;
  }
  if (shouldFetch && loading) return <div className="text-xs">Loading {title}...</div>;
  if (error) return <div className="text-xs text-red-500">Error: {error.message}</div>;
  if (transformError) return <div className="text-xs text-amber-600">Transform warning: {transformError}</div>;

  if (type === 'table') return <TableView title={`${title} (${dataLabel || 'table'})`} data={finalData} />;
  if (type === 'chart') return <ChartView title={`${title} (${dataLabel || 'chart'})`} data={finalData} />;
  return <div className="text-xs">Unsupported quadrant type: {type}</div>;
}
