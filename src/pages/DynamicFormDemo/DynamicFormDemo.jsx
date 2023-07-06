import React, { useState } from "react";
import DynamicForm from "../../components/Dynamic-Components";
import {
  Container,
  Title,
  Wrapper,
  JsonWrapper,
  FormWrapper,
  Textarea,
  ErrMessage,
  Author,
} from "./_appStyle";
import { formData } from "../../data/dummy";
import { Header } from "../../components";

function DynamicFormDemo() {
  const [jsonData, setJsonData] = useState(formData?.fields);
  const [validJsonData, setValidJsonData] = useState(formData?.fields);
  const [errData, setErrData] = useState(false);

  const isJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    if (!isJSON(e.target.value)) {
      setJsonData(e.target.value);
      setErrData(true);
    } else {
      let value = JSON.parse(e.target.value);
      setJsonData(value);
      setValidJsonData(value);
      setErrData(false);
    }
  };

  const handleSubmission = (val) => {
    alert(JSON.stringify(val, null, 4));
  };

  return (
    <Container>
      <Header category="Page" title="Dynamic json forms" />
      <Wrapper>
        <JsonWrapper>
          <h2>JSON Data</h2>
          <Textarea
            name="json-input"
            spellcheck="false"
            value={
              isJSON(jsonData) || typeof jsonData === "object"
                ? JSON.stringify(jsonData, null, 4)
                : jsonData
            }
            onChange={handleInputChange}
          />
          {errData && (
            <ErrMessage>The data you entered is not a VALID json</ErrMessage>
          )}
        </JsonWrapper>
        <FormWrapper>
          <h2>My Amazing Form</h2>
          <DynamicForm fields={validJsonData} submit={formData?.submit} cbSubmit={handleSubmission} />
        </FormWrapper>
      </Wrapper>
      <Author>
        Crafted with <span>&#10084;</span> by{" "}
        <a href="https://github.com/ridoansaleh/">Ridoan</a>
      </Author>
    </Container>
  );
}

export default DynamicFormDemo;
