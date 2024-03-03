import React, { useState } from "react";
import TranslationComponent from "../TranslationComponent";
import RadioButton from "./RadioButton";
import { ErrorMessage, Field, FieldArray, useFormikContext } from "formik";
import { ClassesDropdown } from "./FormDropdowns";

const Step5 = () => {
  const { values, setFieldValue } = useFormikContext();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleChange = (valueName, event) => {
    setFieldValue(valueName, event.target.value);
  };

  const handleChange3 = (field, index, e) => {
    setFieldValue(`Bullies.${index}.${field}`, e.target.value);
    setFieldValue("totalBullies", index);
  };

  const handleChange2 = (valueName, event) => {
    setFieldValue(valueName, event.target.value);
  };

  const addBully = () => {
    setFieldValue("Bullies", [
      ...values.Bullies,
      {
        Firstname: "",
        Lastname: "",
        Gender: "",
        Group: "",
      },
    ]);
  };

  const handleRemoveBully = (indexToRemove) => {
    const updatedBullies = values.Bullies.filter(
      (bully, index) => index !== indexToRemove
    );
    setFieldValue("Bullies", updatedBullies);
  };

  const schoolType = localStorage.getItem("schoolType");

  return (
    <>
      <div className="step-container">
        <TranslationComponent
          keys={["who_was_bully"]}
          school={schoolType}
          className="step-heading"
        />

        {/* TODO: directly show one entry */}
        <FieldArray name="Bullies">
          {({ push, remove, form: { errors, touched } }) => (
            <>
              {values?.Bullies.map((bully, index) => {
                let errorMsgs = null;
                if (
                  errors.Bullies &&
                  errors.Bullies[index] &&
                  touched.Bullies &&
                  touched.Bullies[index]
                ) {
                  errorMsgs = {
                    Firstname: touched.Bullies[index]?.Firstname
                      ? errors.Bullies[index].Firstname
                      : null,
                    Lastname: touched.Bullies[index]?.Lastname
                      ? errors.Bullies[index].Lastname
                      : null,
                    Gender: touched.Bullies[index]?.Gender
                      ? errors.Bullies[index].Gender
                      : null,
                    Group: touched.Bullies[index]?.Group
                      ? errors.Bullies[index].Group
                      : null,
                  };
                }
                return (
                  <div key={index} className="mb-3 more-victims-div mt-5">
                    <p className="victim-heading font-bold mb-3">
                      <TranslationComponent
                        keys={["bully"]}
                        school={schoolType}
                        className="inline"
                      />{" "}
                      {index + 1}
                    </p>
                    <div>
                      <label htmlFor={`Firstname${index}`}>
                        <TranslationComponent
                          keys={["firstname"]}
                          school={schoolType}
                        />
                      </label>
                      <Field
                        type="text"
                        name={`Bullies.${index}.Firstname`}
                        className="input-field"
                        placeholder="Voer uw voornaam in"
                      />
                      {errorMsgs?.Firstname ? (
                        <div className="error">{errorMsgs.Firstname}</div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-3">
                      <label htmlFor={`Lastname${index}`}>
                        <TranslationComponent
                          keys={["lastname"]}
                          school={schoolType}
                        />
                      </label>
                      <Field
                        type="text"
                        name={`Bullies.${index}.Lastname`}
                        className="input-field"
                        placeholder="Voer uw achternaam in"
                      />
                      {errorMsgs?.Lastname ? (
                        <div className="error">{errorMsgs.Lastname}</div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-3">
                      <label>
                        <TranslationComponent
                          keys={["gender"]}
                          school={schoolType}
                        />
                      </label>
                      <div className="flex items-center gap-5 flex-wrap">
                        <RadioButton
                          name={`Bullies.${index}.Gender`}
                          value="male"
                          onChange={(e) => handleChange3("Gender", index, e)}
                        />
                        <RadioButton
                          name={`Bullies.${index}.Gender`}
                          value="female"
                          onChange={(e) => handleChange3("Gender", index, e)}
                        />
                        <RadioButton
                          name={`Bullies.${index}.Gender`}
                          value="other"
                          onChange={(e) => handleChange3("Gender", index, e)}
                        />
                      </div>
                      {errorMsgs?.Gender ? (
                        <div className="error">{errorMsgs.Gender}</div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-3">
                      <label htmlFor={`class${index}`}>
                        <TranslationComponent
                          keys={["class"]}
                          school={schoolType}
                        />
                      </label>
                      <ClassesDropdown name={`Bullies.${index}.Group`} />
                      {errorMsgs?.Group ? (
                        <div className="error">{errorMsgs.Group}</div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="form-button secondary"
                        onClick={() => handleRemoveBully(index)}
                      >
                        <TranslationComponent
                          keys={["remove_bully"]}
                          school={schoolType}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center gap-5 flex-wrap">
                <button
                  type="button"
                  className="form-button"
                  onClick={(e) => {
                    addBully();
                  }}
                >
                  <TranslationComponent
                    keys={["add_bully"]}
                    school={schoolType}
                  />
                </button>
              </div>
            </>
          )}
        </FieldArray>
        {/* <ErrorMessage className="error" component="div" name="Bullies" /> */}
      </div>
    </>
  );
};

export default Step5;
