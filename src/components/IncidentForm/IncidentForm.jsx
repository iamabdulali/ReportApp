import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step5 from "./Step5";
import { validationSchema } from "./ValidationSchema";
import TranslationComponent from "../TranslationComponent";
import Summary from "./Summary";
import { useNavigate } from "react-router-dom";
import { deepCopyWithTrue } from "../../utils/utils";

const initialValues = {
  SchoolId: localStorage.getItem("schoolId"),
  LocationId: "",
  IncidentDescription: "",
  IncidentDate: new Date().toISOString().split("T")[0], // Set to today's date
  Notifier: {
    Firstname: "",
    Lastname: "",
    Gender: "",
    Group: "",
    Emailaddress: "",
    Role: "0",
  },
  victimSelf: "yes",
  totalVictims: 0,
  totalBullies: 1,
  Victims: [],
  Bullies: [],
};

const IncidentForm = () => {
  const [step, setStep] = useState(0);
  const [submit, setSubmit] = useState(false);
  const Navigate = useNavigate();
  const schoolType = localStorage.getItem("schoolType");
  const schoolName = localStorage.getItem("schoolName");

  const handlePrev = () => {
    step >= 1 ? setStep(step - 1) : setStep(0);
  };

  const handleNext = (values, { setTouched, setErrors }) => {
    try {
      // Validate only the fields for the current step
      const fieldsToValidate = Object.keys(validationSchema.fields).filter(
        (field) => {
          // Customize this condition based on your step logic
          if (step === 0) {
            return [
              "IncidentDescription",
              "IncidentDate",
              "LocationId",
            ].includes(field);
          } else if (step === 1) {
            return ["Notifier"].includes(field);
          } else if (step === 2) {
            return ["Victims"].includes(field);
          } else if (step === 3) {
            // TODO: check for at least 1 bully
            return ["Bullies"].includes(field);
          }
          return true; // Include all fields if not in a specific step
        }
      );

      validationSchema
        .pick(fieldsToValidate)
        .validateSync(values, { abortEarly: false });

      // Increment the step
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      if (error.name === "ValidationError") {
        // Display validation errors even if the user is trying to move to the next step
        console.error("Validation errors:", error.errors);

        // Set touched for all fields to trigger error messages
        const touchedState = deepCopyWithTrue(values);
        setTouched(touchedState);

        let errorsArr = [];
        if ("inner" in error && Array.isArray(error.inner)) {
          errorsArr = error.inner;
        } else {
          errorsArr = error.errors;
        }
        // Set errors to display them in the form
        const errorState = errorsArr.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(errorState);
      } else {
        // Handle other errors
        console.error("Error:", error.message);
      }
    }
  };

  const steps = [<Step1 />, <Step2 />, <Step3 />, <Step5 />];

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission
    console.log(values);

    try {
      const response = await fetch(
        "https://wjhulzebosch.nl/Avarix/MeldboxApi/Incident/New?forceFail=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("Form data sent successfully!");
        // Navigate to success page
        Navigate("/success");
      } else {
        console.error("Error sending form data:", response.status);
        // Handle error accordingly
        const errorData = await response.json();
        console.error("Error response body:", errorData);
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      // Handle error accordingly
    }

    // Make sure to call setSubmitting(false) to inform Formik that submission is complete
    setSubmitting(false);
  };

  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, values, setErrors, setTouched }) => (
          <Form>
            <div className="form-progress-container">
              <div className="flex justify-center gap-4">
                <TranslationComponent
                  school={schoolType}
                  keys={["incident_report_form"]}
                  className="form-heading"
                />
                <p className="form-heading">{schoolName}</p>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(step / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            {step === steps.length && <Summary values={values} />}
            {steps[step]}
            <div className="form-wrap">
              <div className="form-buttons-div">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="form-button previous-btn"
                >
                  <TranslationComponent
                    keys={["previous"]}
                    school={schoolType}
                    className="inline"
                  />
                </button>
                {step == steps.length ? (
                  <button
                    type={submit ? "submit" : "button"}
                    onClick={() => setSubmit(true)}
                    className="form-button next-btn"
                  >
                    <TranslationComponent
                      keys={["send_report"]}
                      school={schoolType}
                      className="inline"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="form-button next-btn"
                    onClick={() =>
                      handleNext(values, { setTouched, setErrors })
                    }
                    // onClick={() => {
                    //   handleNext();
                    // }}
                  >
                    <TranslationComponent
                      keys={["next"]}
                      school={schoolType}
                      className="inline"
                    />
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IncidentForm;
