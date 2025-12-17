/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from './TextField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';
import RadioButtonField from './RadioButtonField';
import CheckboxField from './CheckboxField';
import UploadField from './UploadField';
import Heading from './Heading';
import Button from '../../Button';
import HiddenField from './HiddenField';

const fieldMap = {
  text: TextField,
  select: SelectField,
  textarea: TextAreaField,
  radio: RadioButtonField,
  checkbox: CheckboxField,
  upload: UploadField,
  heading: Heading,
  hidden: HiddenField,
};

function Field({ fields, formikProps, submitButton, key }) {
  const { errors, touched, values, handleBlur, handleChange, setFieldValue } = formikProps || {};

  return (
    <>
      {fields.map((item, index) => {
        // Conditional show/hide
        if (item.showWhen && item.showWhen.field) {
          const dep = item.showWhen.field;
          const depVal = values?.[dep];
          const shouldShow = (() => {
            if (Object.prototype.hasOwnProperty.call(item.showWhen, 'equals')) return depVal === item.showWhen.equals;
            if (Object.prototype.hasOwnProperty.call(item.showWhen, 'notEquals')) return depVal !== item.showWhen.notEquals;
            if (Array.isArray(item.showWhen.in)) return item.showWhen.in.includes(depVal);
            if (Array.isArray(item.showWhen.notIn)) return !item.showWhen.notIn.includes(depVal);
            return Boolean(depVal);
          })();
          if (!shouldShow) return null;
        }
        const Component = fieldMap[item.type];
        if (item.type && item.isFormField) {
          const error = Object.prototype.hasOwnProperty.call(errors, item.id) && errors[item.id];
          if (!item.type) {
            return null;
          }
          return (
            <>
              <Component
                key={`Filters${key}_${item.id}_${index}`}
                label={item.label}
                name={item.id}
                placeholder={item.placeholder}
                value={values[item.id]}
                defaultValue={item.defaultValue}
                options={item.options}
                touched={touched}
                position={item.position}
                error={error}
                handleBlur={handleBlur}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                style={item.style}
              />
              {index === fields.length - 1 && <Button type="submit" {...submitButton} />}
            </>
          );
        }
        return (
          <Component
            key={index}
            content={item.content}
            name={item.id}
            style={item.style}
            {...item}
          />
        );
      })}
    </>
  );
}

Field.propTypes = {
  fields: PropTypes.instanceOf(Array),
  formikProps: PropTypes.instanceOf(Object),
};

export default Field;
