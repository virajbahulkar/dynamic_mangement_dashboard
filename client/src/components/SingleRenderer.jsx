import React, { Suspense } from 'react';
import { hasComponent, loadComponent } from '../registry/components';

// Minimal skeletons to avoid heavy imports
function Fallback({ title }) {
  return <div style={{ padding: 8, border: '1px solid #eee', fontSize: 12 }}>Loading {title || 'component'}...</div>;
}
function Missing({ type }) {
  return <div style={{ padding: 8, border: '1px solid #f99', background: '#fff5f5', color: '#900', fontSize: 12 }}>Missing component type: {type}</div>;
}

function ensureDefaults(type, params) {
  const next = { ...(params || {}) };
  if (/^chart\./.test(type)) {
    if (!next.height) next.height = 250;
  }
  // Normalize dynamic form inputs if present
  if (type === 'form.dynamic' || next.kind === 'form.dynamic') {
    let fields = next.fields;
    if (!fields && typeof next.fieldsJson === 'string') {
      try { fields = JSON.parse(next.fieldsJson); } catch {}
    }
    if (Array.isArray(fields)) next.fields = fields;
    if (typeof next.cbSubmit !== 'function') {
      next.cbSubmit = (values, helpers) => {
        // eslint-disable-next-line no-console
        console.log('DynamicForm submit', { values });
        if (helpers && typeof helpers.setSubmitting === 'function') helpers.setSubmitting(false);
      };
    }
  }
  // Ensure stable id for components that need it
  if (!next.id) next.id = `slot_${Math.random().toString(36).slice(2, 8)}`;
  return next;
}

export default function SingleRenderer({ type, params, title }) {
  if (!type || !hasComponent(type)) return <Missing type={type || 'unknown'} />;
  const Lazy = React.lazy(() => loadComponent(type).then((mod) => ({ default: mod })));
  const safeParams = ensureDefaults(type, params);
  return (
    <Suspense fallback={<Fallback title={title || type} />}>
      <Lazy {...safeParams} />
    </Suspense>
  );
}
