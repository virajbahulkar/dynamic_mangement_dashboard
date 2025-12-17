import React from 'react';
import PropTypes from 'prop-types';
import { runActions } from '../lib/actions';

export default function TextArea({ id, label, value = '', placeholder = '', rows = 4, onChange, onChangeActions = [], disabled = false }) {
  const [v, setV] = React.useState(String(value ?? ''));
  React.useEffect(() => { setV(String(value ?? '')); }, [value]);
  const handle = (e) => {
    const next = e.target.value;
    setV(next);
    if (typeof onChange === 'function') onChange(next);
    if (Array.isArray(onChangeActions) && onChangeActions.length) runActions(onChangeActions, { value: next });
  };
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-gray-700">{label}</div>}
      <textarea id={id} value={v} onChange={handle} placeholder={placeholder} rows={rows}
        disabled={disabled} className="w-full border rounded px-2 py-1" />
    </label>
  );
}

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func,
  onChangeActions: PropTypes.array,
  disabled: PropTypes.bool,
};
