import React from 'react';
import PropTypes from 'prop-types';
import { runActions } from '../lib/actions';

export default function DateInput({ id, label, value = '', placeholder = '', onChange, onChangeActions = [], disabled = false, min, max }) {
  const [v, setV] = React.useState(value ? String(value).slice(0,10) : '');
  React.useEffect(() => { setV(value ? String(value).slice(0,10) : ''); }, [value]);
  const handle = (e) => {
    const next = e.target.value;
    setV(next);
    if (typeof onChange === 'function') onChange(next);
    if (Array.isArray(onChangeActions) && onChangeActions.length) runActions(onChangeActions, { value: next });
  };
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-gray-700">{label}</div>}
      <input type="date" id={id} value={v} onChange={handle} placeholder={placeholder} disabled={disabled} min={min} max={max}
        className="w-full border rounded px-2 py-1" />
    </label>
  );
}

DateInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onChangeActions: PropTypes.array,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
};
