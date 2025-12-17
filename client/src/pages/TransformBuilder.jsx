import React, { useState } from 'react';

export default function TransformBuilder() {
  const [steps, setSteps] = useState([]);
  const [op, setOp] = useState('pick');
  const [arg, setArg] = useState('');

  const addStep = () => {
    if (!op) return;
    const step = op === 'pick' ? { op, path: arg } : { op, expr: arg };
    setSteps([...steps, step]);
    setArg('');
  };

  return (
    <div className="p-4 space-y-4" aria-label="Transform builder">
      <h2 className="text-lg font-semibold">Transform Builder (Preview)</h2>
      <div className="flex gap-2 items-end">
        <label className="text-xs">Op
          <select value={op} onChange={e => setOp(e.target.value)} className="ml-1 border px-1 py-0.5 text-xs">
            <option value="pick">pick</option>
            <option value="map">map</option>
          </select>
        </label>
        <label className="text-xs">Arg
          <input value={arg} onChange={e => setArg(e.target.value)} className="ml-1 border px-1 py-0.5 text-xs" placeholder={op==='pick'?'path.to.field':'item => ({...item})'} />
        </label>
        <button onClick={addStep} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">Add</button>
      </div>
      <ul className="text-xs list-disc pl-5">
        {steps.map((s,i) => <li key={i}>{s.op} {s.path||s.expr}</li>)}
        {!steps.length && <li className="italic">No steps yet</li>}
      </ul>
      <div className="border p-2 rounded bg-gray-50 text-[10px]">Execution preview coming soon...</div>
    </div>
  );
}
