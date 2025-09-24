import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      <SkeletonBox height={32} />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-2">
          <SkeletonBox height={20} />
        </div>
      ))}
    </div>
  );
}
