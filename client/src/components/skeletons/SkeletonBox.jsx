import React from 'react';

export default function SkeletonBox({ width='100%', height=120, radius=4, className='' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}
