import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { generateClasses, generateStyles } from '../../../helpers';

function SelectField({
  position,
  label,
  style,
  onChange,
  handleBlur,
  name,
  error,
  options,
  touched,
}) {
  const getPosition = (positionVal) => {
    let classNames;
    let labelclassNames;

    switch (positionVal) {
      case 'top':
        classNames = 'flex flex-col';
        labelclassNames = 'mb-2';
        break;
      case 'bottom':
        classNames = 'flex flex-col flex-col-reverse';
        labelclassNames = 'mt-2';
        break;
      case 'left':
        classNames = 'flex mr-2 items-center';
        labelclassNames = 'mr-2';
        break;
      case 'right':
        classNames = 'flex mr-2 flex-row-reverse items-center';
        labelclassNames = 'ml-2';
        break;
      default:
        break;
    }

    return { outerClass: classNames, labelClass: labelclassNames };
  };

  return (
    <>
      <FormControl size="small" className="w-64">
        <div className={getPosition(position)?.outerClass}>
          <div
            id="demo-simple-select-label"
            className={`${getPosition(position).labelClass} ${generateClasses(
              style?.label?.style,
            )}`}
          >
            {label}
          </div>
          <Select
            name={name}
            displayEmpty
            onBlur={handleBlur}
            fullWidth
            style={generateStyles(style)}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (!selected) {
                return <em>Choose LOB</em>;
              }

              return selected;
            }}
            onChange={onChange}
            className=""
          >
            <MenuItem disabled value="">
              <em>Choose LOB</em>
            </MenuItem>
            {options?.map((opt, index) => (
              <MenuItem key={index} value={opt} style={generateStyles(style)}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
      {error && touched[name] && <div className="error">{error}</div>}
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Array),
  error: PropTypes.instanceOf(Object),
  onChange: PropTypes.func.isRequired,
};

SelectField.defaultValue = {
  options: [],
};

export default SelectField;
