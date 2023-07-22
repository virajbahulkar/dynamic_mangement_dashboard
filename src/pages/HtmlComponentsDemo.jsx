import React, { useState } from 'react'
import HtmlComponents from '../components/Dynamic-Components/HtmlComponents/HtmlComponents'
import { HtmlFields } from '../data/dummy'
import {
    Container,
    Title,
    Wrapper,
    JsonWrapper,
    FormWrapper,
    Textarea,
    ErrMessage,
    Author,
} from "../pages/DynamicFormDemo/_appStyle";
import { Header } from '../components';

function HtmlComponentsDemo() {

    const [jsonData, setJsonData] = useState(HtmlFields);
    const [validJsonData, setValidJsonData] = useState(HtmlFields);
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



    return (

        <Container>
            <Header category="Page" title="Dynamic HTML Components" />
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
                    <h2>Dynamic Html component</h2>
                    <HtmlComponents fields={validJsonData} />
                </FormWrapper>
            </Wrapper>
            <Author>
            </Author>
        </Container>
    )
}

export default HtmlComponentsDemo