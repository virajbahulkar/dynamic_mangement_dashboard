import React from 'react';

// Basic container that simply renders its children content area; in builder this hosts nested placements.
export default function Container({ id, title, style = {}, children }) {
  return (
    <div id={id} className="border rounded bg-white" style={{ minHeight: 80, ...style }}>
      {title && (
        <div className="px-2 py-1 border-b text-sm font-medium text-gray-700">{title}</div>
      )}
      <div className="p-2">
        {children || <div className="text-xs text-gray-400">Drop components here</div>}
      </div>
    </div>
  );
}
