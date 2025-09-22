// Simple component registry mapping normalized component kinds to concrete renderers.
// Extend this mapping as more specialized components are added.
import React from 'react';
import QuadrantRenderer from './QuadrantRenderer';

// Generic wrapper that adapts hydrated component + dataSource into QuadrantRenderer shape.
function GenericComponent({ component }) {
  const quadrantLike = {
    title: component.title || component.kind,
    type: component.kind,
    dataSource: component.dataSource ? {
      transport: component.dataSource.transport || 'rest',
      url: component.dataSource.url,
      method: component.dataSource.method,
      baseUrl: component.dataSource.baseUrl,
      pollingMs: component.dataSource.pollingMs,
      transform: component.transformPipeline?.steps,
    } : null,
    props: component.props || {},
    preResolvedData: component.transformedData || component.dataSource?.sampleData || null,
    transformError: component.transformError,
  };
  return <QuadrantRenderer quadrant={quadrantLike} />;
}

const registry = {
  table: GenericComponent,
  chart: GenericComponent,
  metric: GenericComponent,
  generic: GenericComponent,
};

export function resolveComponent(kind) {
  return registry[kind] || registry.generic;
}

export default registry;
