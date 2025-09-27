import React from 'react';

function validateField(schema, value) {
  const errors = [];
  if (schema.enum && value != null && value !== '' && !schema.enum.includes(value)) errors.push('Invalid value');
  if (schema.type === 'string') {
    if (schema.minLength != null && (value?.length || 0) < schema.minLength) errors.push(`Min length ${schema.minLength}`);
    if (schema.maxLength != null && (value?.length || 0) > schema.maxLength) errors.push(`Max length ${schema.maxLength}`);
    if (schema.pattern) {
      try { const re = new RegExp(schema.pattern); if (value && !re.test(value)) errors.push('Invalid format'); } catch {}
    }
  }
  if (schema.type === 'number') {
    if (schema.minimum != null && value != null && value < schema.minimum) errors.push(`Min ${schema.minimum}`);
    if (schema.maximum != null && value != null && value > schema.maximum) errors.push(`Max ${schema.maximum}`);
  }
  return errors;
}

function Field({ name, schema, value, onChange }) {
  const title = schema.title || name;
  const desc = schema.description;
  const common = { className: 'border rounded px-2 py-1 w-full', id: name };
  const errors = validateField(schema, value);

  if (schema.enum) {
    return (
      <label className="block mb-3" htmlFor={name}>
        <div className="text-sm font-medium">{title}</div>
        <select {...common} value={value ?? ''} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">-- Select --</option>
          {schema.enum.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {desc && <div className="text-xs text-gray-500 mt-1">{desc}</div>}
        {errors.length > 0 && <div className="text-xs text-red-600 mt-1">{errors.join(', ')}</div>}
      </label>
    );
  }

  switch (schema.type) {
    case 'boolean':
      return (
        <label className="flex items-center gap-2 mb-3" htmlFor={name}>
          <input id={name} type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />
          <span className="text-sm font-medium">{title}</span>
        </label>
      );
    case 'number':
      return (
        <label className="block mb-3" htmlFor={name}>
          <div className="text-sm font-medium">{title}</div>
          <input {...common} type="number" value={value ?? ''} min={schema.minimum} max={schema.maximum}
            onChange={(e) => onChange(name, e.target.value === '' ? undefined : Number(e.target.value))} />
          {desc && <div className="text-xs text-gray-500 mt-1">{desc}</div>}
          {errors.length > 0 && <div className="text-xs text-red-600 mt-1">{errors.join(', ')}</div>}
        </label>
      );
    case 'string':
    default:
      return (
        <label className="block mb-3" htmlFor={name}>
          <div className="text-sm font-medium">{title}</div>
          <input {...common} type="text" value={value ?? ''} onChange={(e) => onChange(name, e.target.value)} />
          {desc && <div className="text-xs text-gray-500 mt-1">{desc}</div>}
          {errors.length > 0 && <div className="text-xs text-red-600 mt-1">{errors.join(', ')}</div>}
        </label>
      );
  }
}

export default function FormFromSchema({ schema, value, onChange, onValidityChange }) {
  const isObjectSchema = !!schema && schema.type === 'object';
  const properties = (schema && schema.properties) || {};
  const required = new Set((schema && schema.required) || []);
  const [fieldErrors, setFieldErrors] = React.useState({});

  React.useEffect(() => {
    if (!isObjectSchema) {
      onValidityChange && onValidityChange(true);
      return;
    }
    const missing = Array.from(required).filter((r) => value == null || value[r] == null || value[r] === '');
    const invalid = Object.values(fieldErrors).some((arr) => (arr || []).length > 0);
    onValidityChange && onValidityChange(missing.length === 0 && !invalid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObjectSchema, JSON.stringify(value), JSON.stringify(fieldErrors)]);
  const handleChange = (name, newVal) => {
    const next = { ...(value || {}) };
    if (newVal === undefined || newVal === '') delete next[name]; else next[name] = newVal;
    // validate field
    const errs = validateField(properties[name] || {}, next[name]);
    const nextErrors = { ...fieldErrors, [name]: errs };
    setFieldErrors(nextErrors);
    // validate required
    const missing = Array.from(required).filter(r => next[r] == null || next[r] === '');
    const invalid = Object.values(nextErrors).some((arr) => (arr || []).length > 0);
    const isValid = missing.length === 0 && !invalid;
    onValidityChange && onValidityChange(isValid);
    onChange(next);
  };
  if (!isObjectSchema) return <div className="text-sm text-gray-500">No schema</div>;
  return (
    <div>
      {Object.entries(properties).map(([name, s]) => (
        <div key={name}>
          <Field name={name} schema={s} value={value?.[name]} onChange={handleChange} />
          {required.has(name) && (value?.[name] == null || value?.[name] === '') && (
            <div className="text-xs text-red-600 -mt-2 mb-2">This field is required</div>
          )}
        </div>
      ))}
    </div>
  );
}
