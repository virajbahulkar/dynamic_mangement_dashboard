import React, { useState } from "react";
import PropTypes from "prop-types";
import { FieldContainer, Label } from "./_fieldStyles";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { BsFillCheckCircleFill } from "react-icons/bs";

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
          onChange={handleCheckItem}
        >
          {props.options.map((opt, index) => {
            return (
              <FormControlLabel 
                label={opt} 
                value={opt}
                control={<Radio size="sm" checkedIcon={<BsFillCheckCircleFill />} />}
                className="border-1"
                style={{marginLeft: '0', marginRight: '0', paddingRight: '10px'}}
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
