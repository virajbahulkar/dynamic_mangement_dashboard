import React from 'react';
import PropTypes from 'prop-types';
import { FieldContainer, Upload } from './_fieldStyles';

function UploadField({ label, name, value, handleBlur, onChange, error, touched }) {
  return (
    <FieldContainer>
      <div className="label">{label}</div>
      <Upload type="file" name={name} value={value} onBlur={handleBlur} onChange={onChange} />
      {error && touched[name] && <div className="error">{error}</div>}
    </FieldContainer>
  );
}

UploadField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.instanceOf(Object),
  onChange: PropTypes.func.isRequired,
};

UploadField.defaultValue = {};

export default UploadField;
