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
  value,
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

  // Defensive: fallback for undefined options
  const safeOptions = Array.isArray(options) ? options : [];

  // Support both primitives and {label, value} objects
  const getOptionValue = (opt) => (opt && typeof opt === 'object' && opt.value !== undefined ? opt.value : opt);
  const getOptionLabel = (opt) => (opt && typeof opt === 'object' && opt.label !== undefined ? opt.label : String(opt));

  // Defensive: always pass value to Select, and handle onChange for Formik
  const handleSelectChange = (event) => {
    if (typeof onChange === 'function') {
      onChange({
        target: {
          name,
          value: event.target.value,
        },
      });
    }
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
              const found = safeOptions.find((opt) => getOptionValue(opt) === selected);
              return found ? getOptionLabel(found) : String(selected);
            }}
            value={value === undefined || value === null ? '' : value}
            onChange={handleSelectChange}
            className=""
          >
            <MenuItem disabled value="">
              <em>Choose LOB</em>
            </MenuItem>
            {safeOptions.map((opt, index) => (
              <MenuItem key={index} value={getOptionValue(opt)} style={generateStyles(style)}>
                {getOptionLabel(opt)}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
      {error && touched && touched[name] && <div className="error">{error}</div>}
    </>
  );
}


SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Array),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};


SelectField.defaultProps = {
  options: [],
  value: '',
};

export default SelectField;
