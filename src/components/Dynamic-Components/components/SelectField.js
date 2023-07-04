import React from "react";
import PropTypes from "prop-types";
import { FieldContainer } from "./_fieldStyles";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectField(props) {
  return (
    <>
      <FormControl size="small" className="w-64">
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
          name={props.name}
          defaultValue={props.value ?? " "}
          label={props.label}
          onBlur={props.handleBlur}
          onChange={props.onChange}
        >
          {props.options.map((opt, index) => {
            return (
              <MenuItem key={index} value={opt ?? " "}>{opt}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {props.error && props.touched[props.name] && (
        <div className="error">{props.error}</div>
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
