import React from 'react';

export default function FunctionEditor() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Function Editor (Preview)</h2>
      <p className="text-sm text-gray-600">This placeholder will allow creating & testing server meta functions.</p>
      <ol className="list-decimal pl-5 text-xs space-y-1">
        <li>List existing functions (name, version, last updated).</li>
        <li>Edit sandboxed code with validation + lint output.</li>
        <li>Run test inputs & inspect outputs (sample data).</li>
        <li>Publish new version with hash + cache invalidation.</li>
      </ol>
      <div className="border p-3 rounded bg-gray-50 text-xs">Coming soon...</div>
    </div>
  );
}
