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

  const handleCheckItem = (e) => {
    const { name, value } = e.target;
    let items = new Map(checkedItems);
    items.set(name, value);
    setCheckedItems(items);
    setTimeout(() => props.setFieldValue(props.name, Array.from(items.values()).toString()), 0); 
  };

  return (
    <>
      <FormControl size="small">
        <FormLabel id="demo-controlled-radio-buttons-group">{props.label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={props.name}
          row
          onBlur={props.handleBlur}
          style={props.style}
          onChange={handleCheckItem}
          className={generateClasses(props?.style.group)}
        >
          {props.options.map((opt, index) => {
            return (
              <FormControlLabel 
                label={<span className={generateClasses(props?.style?.label)} >{opt}</span>} 
                value={opt}
                className={`${generateClasses(props?.style?.labelBox)}`}
                control={<Radio size="sm" color="success" checkedIcon={<BsFillCheckCircleFill />}  className={generateClasses(props.style.input)} style={generateStyles(props?.style?.input)}  />}
                
                checked={checkedItems.get(props.name + "-" + index)} 
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      {props.error && props.touched[props.name] && (
        <div className="error">{props.error}</div>
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
