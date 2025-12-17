import React from 'react';
import PropTypes from 'prop-types';
import DynamicForm from './Dynamic-Components';

// Thin wrapper to keep "form.wizard" backward-compatible while unifying implementation.
export default function FormWizard(props) {
  // DynamicForm now supports steps (wizard) and fields (single-step)
  // We just forward props through.
  return <DynamicForm {...props} />;
}

FormWizard.propTypes = {
  steps: PropTypes.array,
  stepsJson: PropTypes.string,
  fields: PropTypes.array,
  fieldsJson: PropTypes.string,
  formStyle: PropTypes.oneOf(['inline','stacked']),
  submitButton: PropTypes.shape({ text: PropTypes.string }),
  cbSubmit: PropTypes.func,
};
