import React from "react";
import PropTypes from "prop-types";
import { FieldContainer } from "./_fieldStyles";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { classNames } from "@syncfusion/ej2/buttons";
import { generateClasses, generateStyles } from "../../../helpers";

function SelectField(props) {

  const { position, label, style, onChange, handleBlur, name, error, options, touched} = props || {}

  const getPosition = (position) => {
    let classNames;
    let labelclassNames;
    
    switch (position) {
      case "top":
        classNames = "flex flex-col"
        labelclassNames = "mb-2"
        break;
      case "bottom":
        classNames = "flex flex-col flex-col-reverse"
        labelclassNames = "mt-2"
        break;
      case "left":
        classNames = "flex mr-2 items-center"
        labelclassNames = "mr-2"
        break;
      case "right":
        classNames = "flex mr-2 flex-row-reverse items-center"
        labelclassNames = "ml-2"
        break;
      default:
        break;
    }
    
    return { outerClass: classNames, labelClass: labelclassNames}
  }

  return (
    <>
      <FormControl size="small" className="w-64">
        <div className={getPosition(position)?.outerClass}>
          <div id="demo-simple-select-label" className={getPosition(position).labelClass+' '+generateClasses(style?.label?.style)}>{label}</div>
          <Select
            name={name}
            displayEmpty
            onBlur={handleBlur}
            fullWidth
            style={generateStyles(style)}
            onChange={onChange}
            className=""
          >
          <MenuItem disabled value="">
            <em>Placeholder</em>
          </MenuItem>
            {options?.map((opt, index) => {
              return (
                <MenuItem key={index} value={opt}  style={generateStyles(style)}>{opt}</MenuItem>
              );
            })}
          </Select>
        </div>
      </FormControl>
      {error && touched[name] && (
        <div className="error">{error}</div>
      )}
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
  error: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

SelectField.defaultValue = {
  options: [],
};

export default SelectField;
