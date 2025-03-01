import React from 'react';
import PropTypes from 'prop-types';
import { FieldContainer, TextArea } from './_fieldStyles';

function TextAreaField({ label, name, placeholder, value, handleBlur, onChange, error, touched }) {
  return (
    <FieldContainer>
      <div className="label">{label}</div>
      <TextArea
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={onChange}
      />
      {error && touched[name] && <div className="error">{error}</div>}
    </FieldContainer>
  );
}

TextAreaField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.instanceOf(Object),
  onChange: PropTypes.func.isRequired,
};

TextAreaField.defaultProps = {
  label: '',
  placeholder: '',
  value: '',
  error: '',
};

export default TextAreaField;
