import React from "react";
import PropTypes from "prop-types";
import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import RadioButtonField from "./RadioButtonField";
import CheckboxField from "./CheckboxField";
import UploadField from "./UploadField";
import Heading from "./Heading";
import Button from "../../Button";

const fieldMap = {
  text: TextField,
  select: SelectField,
  textarea: TextAreaField,
  radio: RadioButtonField,
  checkbox: CheckboxField,
  upload: UploadField,
  heading: Heading
};

function Field({ fields, formikProps, submit }) {

  const getComponents = (Component, item, index) => {
   
   
  }

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    submitForm,
    setFieldValue,
  } = formikProps || {};

  return (
    <>
      {fields.map((item, index) => { 
        const Component = fieldMap[item.type]
        if(item.type && item.isFormField) {
          let error = errors.hasOwnProperty(item.id) && errors[item.id];
          if (!item.type) {
            return null;
          }
          return (
            <>
              <Component
                key={index}
                label={item.label}
                name={item.id}
                placeholder={item.placeholder}
                value={values[item.id]}
                options={item.options}
                touched={touched}
                error={error}
                handleBlur={(e) => {
                  handleBlur(e);
                
                  
                }}
                onChange={(e) => {
                  handleChange(e);
                  
                }}
                setFieldValue={setFieldValue}
               
              />
             
            </>
          );
        } else {
          return (
            <Component
                key={index}
                content={item.label}
                name={item.id}
                typeAs={item.typeAs}
                style={item.style}
                
              />
          );
        }

      })}
    </>
  )

 
}

Field.propTypes = {
  fields: PropTypes.array.isRequired,
  formikProps: PropTypes.object.isRequired,
};

export default Field;
