import { ErrorMessage, Field, useFormikContext } from "formik";
import React, { useState, useEffect } from "react";
import TranslationComponent from "../TranslationComponent";
import { LocationDropdown } from "./FormDropdowns";

const Step1 = () => {
  const [textareaHeight, setTextareaHeight] = useState("47px");
  const [wordCount, setWordCount] = useState(0);

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Count words
    const words = values.whatHappened.trim().split(/\s+/);
    setWordCount(values.whatHappened.trim() === "" ? 0 : words.length);
  }, [values.whatHappened]);
  
  const handleChange = (event) => {
    const textarea = event.target;
    setTextareaHeight("");
    setTextareaHeight(Math.min(textarea.scrollHeight, 300) + "px");

    // Count words
    const words = textarea.value.trim().split(/\s+/);
    setWordCount(textarea.value.trim() === "" ? 0 : words.length);

    setFieldValue("whatHappened", event.target.value);
  };

  const schoolType = localStorage.getItem("schoolType");

  return (
    <div className="step-container">
      <TranslationComponent
        keys={["incident_report_form_intro"]}
        school={schoolType}
        className="step-heading"
      />
      <div>
        <label htmlFor="location">Waar</label>
        <LocationDropdown />
        <ErrorMessage name="location" component="div" className="error" />
      </div>
      <div className="mt-3">
        <label htmlFor="datetime">
          <TranslationComponent keys={["when"]} school={schoolType} />
        </label>
        <Field type="date" name="date" className="input-field dateField" />
        <ErrorMessage name="date" component="div" className="error" />
      </div>
      <div className="mt-3">
        <label htmlFor="whatHappened">
          <TranslationComponent keys={["what_happened"]} school={schoolType} />
        </label>
        <Field
          as="textarea"
          name="whatHappened"
          className="input-field dateField"
          style={{ height: textareaHeight, minHeight: "47px" }}
          onChange={handleChange}
        />
        <ErrorMessage name="whatHappened" component="div" className="error" />
      </div>
      <div className="word-count">{wordCount} / 500 woorden</div>
    </div>
  );
};

export default Step1;
