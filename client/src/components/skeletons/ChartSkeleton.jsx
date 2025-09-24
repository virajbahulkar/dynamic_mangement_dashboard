import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBox height={24} width={180} />
      <SkeletonBox height={200} />
    </div>
  );
}
