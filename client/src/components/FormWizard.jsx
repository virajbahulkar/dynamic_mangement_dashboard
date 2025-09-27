import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import Fields from './Dynamic-Components/components';
import { createYupSchema } from './Dynamic-Components/utils/yupSchemaCreator';

function evaluateShowWhen(showWhen, values) {
  if (!showWhen || !showWhen.field) return true;
  const val = values?.[showWhen.field];
  if (Object.prototype.hasOwnProperty.call(showWhen, 'equals')) return val === showWhen.equals;
  if (Object.prototype.hasOwnProperty.call(showWhen, 'notEquals')) return val !== showWhen.notEquals;
  if (Array.isArray(showWhen.in)) return showWhen.in.includes(val);
  if (Array.isArray(showWhen.notIn)) return !showWhen.notIn.includes(val);
  return Boolean(val);
}

export default function FormWizard({ steps = [], formStyle = 'stacked', submitButton = { text: 'Submit' }, cbSubmit }) {
  // Flatten all fields for initial values and global validation schema
  const allFields = steps.flatMap((s) => Array.isArray(s.fields) ? s.fields : []);
  const initialValues = {};
  allFields.forEach((f) => { initialValues[f.id] = f.value || ''; });
  const yupSchema = allFields.reduce(createYupSchema, {});
  const validationSchema = yup.object().shape(yupSchema);

  const [stepIndex, setStepIndex] = React.useState(0);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={cbSubmit || ((vals, helpers) => { console.log('Wizard submit', vals); helpers?.setSubmitting?.(false); })}>
      {(formikProps) => {
        const { values, isSubmitting, handleSubmit } = formikProps;
        // Compute visible steps based on showWhen and current values
        const visibleSteps = steps.filter((s) => evaluateShowWhen(s.showWhen, values));
        const clampedIndex = Math.max(0, Math.min(stepIndex, Math.max(0, visibleSteps.length - 1)));
        const active = visibleSteps[clampedIndex] || { id: 'step-0', title: 'Step', fields: [] };
        const isLast = clampedIndex === visibleSteps.length - 1;

        const goNext = () => setStepIndex((i) => Math.min(i + 1, Math.max(0, visibleSteps.length - 1)));
        const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

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

FormWizard.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    showWhen: PropTypes.object,
    fields: PropTypes.arrayOf(PropTypes.object),
  })),
  formStyle: PropTypes.oneOf(['inline', 'stacked']),
  submitButton: PropTypes.shape({ text: PropTypes.string }),
  cbSubmit: PropTypes.func,
};
import React from 'react';
import DynamicForm from './Dynamic-Components';

// Contract:
// props: { steps: [{ id, title, fields, showWhen? }], formStyle, submitButton }
// Emits final onSubmit(values)
export default function FormWizard({ steps = [], formStyle = 'stacked', submitButton = { text: 'Submit' }, onSubmit }) {
  const [current, setCurrent] = React.useState(0);
  const [values, setValues] = React.useState({});

  const evalShow = (cond) => {
    if (!cond || !cond.field) return true;
    const v = values?.[cond.field];
    if (Object.prototype.hasOwnProperty.call(cond, 'equals')) return v === cond.equals;
    if (Object.prototype.hasOwnProperty.call(cond, 'notEquals')) return v !== cond.notEquals;
    if (Array.isArray(cond.in)) return cond.in.includes(v);
    if (Array.isArray(cond.notIn)) return !cond.notIn.includes(v);
    return Boolean(v);
  };

  const visibleSteps = steps.filter((s) => evalShow(s.showWhen));
  const step = visibleSteps[current] || visibleSteps[0];

  const mergedFields = (step?.fields || []).map((f) => {
    // Carry forward stored values as default
    return { ...f, value: values[f.id] ?? f.value };
  });

  const handleSubmit = (vals) => {
    const next = { ...values, ...vals };
    setValues(next);
    if (current < visibleSteps.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      if (typeof onSubmit === 'function') onSubmit(next);
    }
  };

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  if (!step) return <div>No steps</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Step {current + 1} of {visibleSteps.length}: {step.title || step.id}</div>
        <div className="space-x-2">
          <button className="px-3 py-1 text-sm border rounded disabled:opacity-50" disabled={current === 0} onClick={goPrev}>Back</button>
        </div>
      </div>
      <DynamicForm fields={mergedFields} formStyle={formStyle} submitButton={submitButton} cbSubmit={handleSubmit} />
    </div>
  );
}
