import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { generateClasses, generateStyles } from '../../../helpers';

function HiddenField({
  label,
  style,
  setFieldValue,
  handleBlur,
  name,
  error,
  options,
  touched,
  defaultValue,
}) {
  const [checkedItems, setCheckedItems] = useState(new Map());

  const handleCheckItem = (e) => {
    const { value } = e.target;
    const items = new Map(checkedItems);
    items.set(e.target.name, value);
    setCheckedItems(items);
    setTimeout(() => setFieldValue(e.target.name, Array.from(items.values()).toString()), 0);
  };

  return (
    <>
      <FormControl size="small">
        <FormLabel id="demo-controlled-radio-buttons-group">{label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={name}
          row
          onBlur={handleBlur}
          defaultValue={defaultValue}
          sx={{ display: { md: 'none' } }}
          style={style}
          onChange={handleCheckItem}
          className={generateClasses(style?.group)}
        >
          {options.map((opt, index) => (
            <FormControlLabel
              key={index}
              label={
                <span className={generateClasses(style?.label)}>
                  {typeof opt === 'object' ? opt.label : opt}
                </span>
              }
              value={typeof opt === 'object' ? opt.value : opt}
              className={generateClasses(style?.labelBox)}
              control={
                <Radio
                  size="sm"
                  color="success"
                  checkedIcon={<BsFillCheckCircleFill />}
                  className={generateClasses(style?.input)}
                  style={generateStyles(style?.input)}
                />
              }
              checked={checkedItems.get(`${name}-${index}`)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {error && touched[name] && <div className="error">{error}</div>}
    </>
  );
}

HiddenField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Array),
  error: PropTypes.instanceOf(Object),
  setFieldValue: PropTypes.func.isRequired,
};

export default HiddenField;
