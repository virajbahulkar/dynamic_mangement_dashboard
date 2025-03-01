import React from 'react';
import PropTypes from 'prop-types';
import { FieldContainer, Input } from './_fieldStyles';

function TextField({
  label,
  name,
  type,
  placeholder,
  value,
  handleBlur,
  onChange,
  error,
  touched,
}) {
  return (
    <FieldContainer>
      <div className="label">{label}</div>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onBlur={handleBlur}
        onChange={onChange}
      />
      {error && touched[name] && <div className="error">{error}</div>}
    </FieldContainer>
  );
}

TextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.instanceOf(Object),
  onChange: PropTypes.func.isRequired,
};

export default TextField;
