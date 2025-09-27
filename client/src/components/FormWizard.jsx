import React from 'react';
import DynamicForm from './Dynamic-Components';

// Contract:
// props: { steps: [{ id, title, fields, showWhen? }], formStyle, submitButton }
// Emits final onSubmit(values)
export default function FormWizard({ steps = [], formStyle = 'stacked', submitButton = { text: 'Submit' }, onSubmit }) {
  const [current, setCurrent] = React.useState(0);
  const [values, setValues] = React.useState({});

  const evalShow = (cond) => {
    if (!cond || !cond.field) return true;
    const v = values?.[cond.field];
    if (Object.prototype.hasOwnProperty.call(cond, 'equals')) return v === cond.equals;
    if (Object.prototype.hasOwnProperty.call(cond, 'notEquals')) return v !== cond.notEquals;
    if (Array.isArray(cond.in)) return cond.in.includes(v);
    if (Array.isArray(cond.notIn)) return !cond.notIn.includes(v);
    return Boolean(v);
  };

  const visibleSteps = steps.filter((s) => evalShow(s.showWhen));
  const step = visibleSteps[current] || visibleSteps[0];

  const mergedFields = (step?.fields || []).map((f) => {
    // Carry forward stored values as default
    return { ...f, value: values[f.id] ?? f.value };
  });

  const handleSubmit = (vals) => {
    const next = { ...values, ...vals };
    setValues(next);
    if (current < visibleSteps.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      if (typeof onSubmit === 'function') onSubmit(next);
    }
  };

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  if (!step) return <div>No steps</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Step {current + 1} of {visibleSteps.length}: {step.title || step.id}</div>
        <div className="space-x-2">
          <button className="px-3 py-1 text-sm border rounded disabled:opacity-50" disabled={current === 0} onClick={goPrev}>Back</button>
        </div>
      </div>
      <DynamicForm fields={mergedFields} formStyle={formStyle} submitButton={submitButton} cbSubmit={handleSubmit} />
    </div>
  );
}
