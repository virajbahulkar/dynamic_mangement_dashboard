import React, { useState } from "react";
import PropTypes from "prop-types";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { generateClasses, generatePsudoClassesEven, generatePsudoClassesOdd, generateStyles } from "../../../helpers";

function RadioButtonField(props) {
  const [checkedItems, setCheckedItems] = useState(new Map());

  const { label, style, setFieldValue, handleBlur, name, error, options, touched} = props || {}

  const handleCheckItem = (e) => {
    const { name, value } = e.target;
    let items = new Map(checkedItems);
    items.set(name, value);
    setCheckedItems(items);
    setTimeout(() => setFieldValue(name, Array.from(items.values()).toString()), 0); 
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
          style={style}
          onChange={handleCheckItem}
          className={generateClasses(style?.group)}
        >
          {options.map((opt, index) => {
            return (
              <FormControlLabel 
                label={<span className={generateClasses(style?.label)} >{opt}</span>} 
                value={opt}
                className={`${generateClasses(style?.labelBox)}`}
                control={<Radio size="sm" color="success" checkedIcon={<BsFillCheckCircleFill />}  className={generateClasses(style?.input)} style={generateStyles(style?.input)}  />}
                
                checked={checkedItems.get(name + "-" + index)} 
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      {error && touched[name] && (
        <div className="error">{error}</div>
      )}
      </>
  );
}

RadioButtonField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  error: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default RadioButtonField;
