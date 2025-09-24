import React from 'react';
import useHydratedPage from '../hooks/useHydratedPage';
import PageRenderer from './PageRenderer';

// Simplified: leverage PageRenderer with hydrated placements + maps
export default function HydratedDashboard({ appId = 'default', slug = 'management-dashboard', overrideParams }) {
  const { placements, assetsMap, componentsMap, loading, error } = useHydratedPage(appId, slug, true);

  if (error) return <div className="text-xs p-2 text-red-500" role="alert">Error: {error.message}</div>;
  return (
    <PageRenderer
      placements={placements}
      assetsMap={assetsMap}
      componentsMap={componentsMap}
      loading={loading}
      overrideParams={overrideParams}
    />
  );
}
