import React from 'react';
import PropTypes from 'prop-types';
import { runActions } from '../lib/actions';

export default function MultiSelect({ id, label, options = [], value = [], placeholder = 'Select...', onChange, onChangeActions = [], disabled = false }) {
  const [internal, setInternal] = React.useState(Array.isArray(value) ? value : []);
  React.useEffect(() => { setInternal(Array.isArray(value) ? value : []); }, [value]);
  const handleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    setInternal(selected);
    if (typeof onChange === 'function') onChange(selected);
    if (Array.isArray(onChangeActions) && onChangeActions.length) runActions(onChangeActions, { value: selected });
  };
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-gray-700">{label}</div>}
      <select id={id} multiple value={internal} onChange={handleChange} disabled={disabled}
        className="w-full border rounded px-2 py-1 min-h-[120px]" aria-label={label || placeholder}>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label ?? String(opt.value)}</option>
        ))}
      </select>
    </label>
  );
}

MultiSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })),
  value: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onChangeActions: PropTypes.array,
  disabled: PropTypes.bool,
};
