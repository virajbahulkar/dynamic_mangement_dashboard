import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Formik, useFormikContext  } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import Fields from "./components";
import { createYupSchema } from "./utils/yupSchemaCreator";
import { FIELD_TYPES, VALIDATION_TYPES } from "./constants";
import Button from "../Button";
import { useStateContext } from "../../contexts/ContextProvider";



function DynamicForm(props) {
  const { fields, formStyle, submit, cbSubmit } = props;
  const { filters } = useStateContext();
  const initialValues = {};
  fields?.forEach(item => {
    initialValues[item.id] = item.value || "";
  });

  const yupSchema = fields?.reduce(createYupSchema, {});

  const validateSchema = yup.object().shape(yupSchema);


  // useEffect(() => {
  //   if(filters) {
  //     submitForm()
  //   }
  // }, [filters])
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validateSchema}
      onSubmit={cbSubmit}
    >
      {formikProps => (
        <form onSubmit={formikProps.handleSubmit} className={formStyle === "inline" ? `w-full flex gap-5` : `w-full`}>
        {fields ? <Fields fields={fields} formikProps={formikProps} /> : <></>}
          {<Button type="submit" text={"Submit"} /> }
        </form>
      )}
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
      value: PropTypes.any,
      options: PropTypes.array,
      validations: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          params: PropTypes.array.isRequired
        })
      )
    })
  ).isRequired,
  cbSubmit: PropTypes.func.isRequired
};

export default DynamicForm;
