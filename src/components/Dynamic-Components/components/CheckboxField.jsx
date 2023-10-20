import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function CheckboxField({ name, label, setFieldValue, style, options, error, touched }) {
  const [checkedItems, setCheckedItems] = useState(new Map());

  const handleCheckItem = (e) => {
    const items = new Map(checkedItems);
    if (items.has(e.target.name)) {
      items.delete(e.target.name);
    } else {
      items.set(e.target.name, e.target.value);
    }

    setCheckedItems(items);
    setTimeout(() => setFieldValue(name, Array.from(items.values()).toString()), 0);
  };

  return (
    <>
      <FormControl size="small">
        <FormLabel id="demo-controlled-radio-buttons-group">{label}</FormLabel>
        <FormGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={name}
          row
          onChange={handleCheckItem}
          className={`p-${style?.padding?.all} border-${style?.border?.width}`}
        >
          {options.map((opt, index) => (
            <FormControlLabel
              key={index}
              label={
                <span className={`text-${style?.font?.size} border-${style?.border?.width}`}>
                  {opt}
                </span>
              }
              value={opt}
              control={<Checkbox />}
              checked={checkedItems.get(`${name}-${index}`)}
            />
          ))}
        </FormGroup>
      </FormControl>
      {error && touched[name] && <div className="error">{error}</div>}
    </>
  );
}

CheckboxField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Array),
  error: PropTypes.instanceOf(Object),
  setFieldValue: PropTypes.func.isRequired,
  style: PropTypes.instanceOf(Object),
  touched: PropTypes.instanceOf(Object),
};

export default CheckboxField;
