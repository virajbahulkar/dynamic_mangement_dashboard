import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import Fields from './components';
import { createYupSchema } from './utils/yupSchemaCreator';
import { FIELD_TYPES, VALIDATION_TYPES } from './constants';

function evaluateShowWhen(showWhen, values) {
  if (!showWhen || !showWhen.field) return true;
  const val = values?.[showWhen.field];
  if (Object.prototype.hasOwnProperty.call(showWhen, 'equals')) return val === showWhen.equals;
  if (Object.prototype.hasOwnProperty.call(showWhen, 'notEquals')) return val !== showWhen.notEquals;
  if (Array.isArray(showWhen.in)) return showWhen.in.includes(val);
  if (Array.isArray(showWhen.notIn)) return !showWhen.notIn.includes(val);
  return Boolean(val);
}

function DynamicForm(props) {
  const { fields: fieldsProp, fieldsJson, steps: stepsProp, stepsJson, formStyle, submitButton, cbSubmit, actions, actionsJson, key } = props;

  // Normalize inputs: prefer steps if provided; support stepsJson and fieldsJson outside via PageRenderer
  let steps = Array.isArray(stepsProp) ? stepsProp : undefined;
  let fields = Array.isArray(fieldsProp) ? fieldsProp : undefined;
  if (!fields && typeof fieldsJson === 'string') {
    try { const arr = JSON.parse(fieldsJson); if (Array.isArray(arr)) fields = arr; } catch {}
  }
  if (!steps && typeof stepsJson === 'string') {
    try { const arr = JSON.parse(stepsJson); if (Array.isArray(arr)) steps = arr; } catch {}
  }

  // Wizard mode when steps are provided
  const isWizard = Array.isArray(steps) && steps.length > 0;

  // Build initial values and validation from all fields
  const allFields = isWizard ? steps.flatMap((s) => Array.isArray(s.fields) ? s.fields : []) : (fields || []);
  const initialValues = {};
  allFields.forEach((item) => { if (item?.id) initialValues[item.id] = item.value ?? ''; });
  const yupSchema = allFields.reduce(createYupSchema, {});
  const validateSchema = yup.object().shape(yupSchema);

  const [stepIndex, setStepIndex] = React.useState(0);

  // Normalize actions
  let submitActions = Array.isArray(actions) ? actions : undefined;
  if (!submitActions && typeof actionsJson === 'string') {
    try { const arr = JSON.parse(actionsJson); if (Array.isArray(arr)) submitActions = arr; } catch {}
  }

  return (
  <Formik initialValues={initialValues} validationSchema={validateSchema} onSubmit={async (vals, helpers) => {
      try {
        if (typeof cbSubmit === 'function') await cbSubmit(vals, helpers);
        if (Array.isArray(submitActions) && submitActions.length) {
          const { runActions } = await import('../../lib/actions');
          await runActions(submitActions, { values: vals });
        }
      } finally { if (helpers?.setSubmitting) helpers.setSubmitting(false); }
    }}>
      {(formikProps) => {
        const { values, handleSubmit, isSubmitting, errors, setTouched, validateForm } = formikProps;

        if (!isWizard) {
          return (
            <form onSubmit={handleSubmit} className={formStyle === 'inline' ? 'w-full flex gap-3' : 'w-full'}>
              {allFields && allFields.length > 0 ? (
                <Fields fields={allFields} formikProps={formikProps} submitButton={submitButton} key={key} />
              ) : <span />}
            </form>
          );
        }

        // Wizard mode
        const visibleSteps = steps.filter((s) => evaluateShowWhen(s.showWhen, values));
        const clampedIndex = Math.max(0, Math.min(stepIndex, Math.max(0, visibleSteps.length - 1)));
        const active = visibleSteps[clampedIndex] || { id: 'step-0', title: 'Step', fields: [] };
        const isLast = clampedIndex === visibleSteps.length - 1;

        const goBack = () => setStepIndex((i) => Math.max(0, i - 1));
        const goNext = async () => {
          const stepFieldIds = (active.fields || []).map((f) => f.id).filter(Boolean);
          if (stepFieldIds.length) {
            setTouched(stepFieldIds.reduce((acc, id) => { acc[id] = true; return acc; }, {}), false);
            await validateForm();
            const hasErrors = stepFieldIds.some((id) => !!errors?.[id]);
            if (hasErrors) return;
          }
          setStepIndex((i) => Math.min(i + 1, Math.max(0, visibleSteps.length - 1)));
        };

        return (
          <form onSubmit={handleSubmit} className={formStyle === 'inline' ? 'w-full flex gap-3' : 'w-full'}>
            {active?.title && (
              <div className="mb-2 text-sm font-medium text-gray-700">{active.title}</div>
            )}
            <Fields fields={active.fields || []} formikProps={formikProps} submitButton={null} />
            <div className="mt-3 flex gap-2">
              <button type="button" disabled={clampedIndex === 0} onClick={goBack} className="px-3 py-1.5 border rounded disabled:opacity-50">Back</button>
              {!isLast ? (
                <button type="button" onClick={goNext} className="px-3 py-1.5 bg-blue-600 text-white rounded">Next</button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-emerald-600 text-white rounded">{submitButton?.text || 'Submit'}</button>
              )}
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

DynamicForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.oneOf(FIELD_TYPES).isRequired,
      validationType: PropTypes.oneOf(VALIDATION_TYPES).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      options: PropTypes.instanceOf(Array),
      validations: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          params: PropTypes.instanceOf(Array).isRequired,
        }),
      ),
      showWhen: PropTypes.object,
    }),
  ),
  fieldsJson: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      showWhen: PropTypes.object,
      fields: PropTypes.array,
    })
  ),
  stepsJson: PropTypes.string,
  actions: PropTypes.array,
  actionsJson: PropTypes.string,
  cbSubmit: PropTypes.func,
};

export default DynamicForm;
