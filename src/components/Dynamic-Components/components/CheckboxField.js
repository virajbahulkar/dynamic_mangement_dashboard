import React, { useState } from "react";
import PropTypes from "prop-types";
import { FieldContainer, Label } from "./_fieldStyles";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function CheckboxField(props) {
  const [checkedItems, setCheckedItems] = useState(new Map());

  const handleCheckItem = (e) => {
    const { name, value } = e.target;
    let items = new Map(checkedItems);
    if(items.has(name)) {
      items.delete(name)
    } else {
      items.set(name, value);
    }
    
    setCheckedItems(items);
    setTimeout(() => props.setFieldValue(props.name, Array.from(items.values()).toString()), 0); 
  };

  return (
    <>
      <FormControl size="small">
        <FormLabel id="demo-controlled-radio-buttons-group">{props.label}</FormLabel>
        <FormGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={props.name}
          row
          onBlur={props.handleBlur}
          onChange={handleCheckItem}
          className={`p-${props?.style?.padding?.all} border-${props?.style?.border?.width}`}
        >
          {props.options.map((opt, index) => {
            return (
              <FormControlLabel 
                label={<span className={`text-${props?.style?.font?.size} border-${props?.style?.border?.width}`}>{opt}</span>} 
                value={opt}
                control={<Checkbox />}
                checked={checkedItems.get(props.name + "-" + index)} 
              />
            );
          })}
        </FormGroup>
      </FormControl>
      {props.error && props.touched[props.name] && (
        <div className="error">{props.error}</div>
      )}
      </>
  );
}

CheckboxField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  error: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default CheckboxField;
