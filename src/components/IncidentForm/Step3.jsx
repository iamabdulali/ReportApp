import React, { useState } from "react";
import TranslationComponent from "../TranslationComponent";
import RadioButton from "./RadioButton";
import { ErrorMessage, Field, useFormikContext, FieldArray } from "formik";
import { ClassesDropdown } from "./FormDropdowns";

const Step3 = () => {
  const [isVictimSelf, setIsVictimSelf] = useState(true);
  const { values, setFieldValue } = useFormikContext();
  const [height, setHeight] = useState(true);

  const handleChange = (valueName, event) => {
    setFieldValue(valueName, event.target.value);
    if (valueName === "victimSelf") {
      setIsVictimSelf(event.target.value === "self");
    }
  };

  const handleChange3 = (field, index, e) => {
    setFieldValue(`Victims.${index}.${field}`, e.target.value);
    // setFieldValue("totalVictims", index);
  };

  const handleChange2 = (valueName, event) => {
    setFieldValue(valueName, event.target.value);
  };

  const addVictim = () => {
    setFieldValue("Victims", [
      ...values.Victims,
      {
        Firstname: "",
        Lastname: "",
        Gender: "",
        Group: "",
      },
    ]);
  };

  const handleRemoveVictim = (indexToRemove) => {
    const updatedVictims = values.Victims.filter(
      (victim, index) => index !== indexToRemove
    );
    setFieldValue("Victims", updatedVictims);
  };

  const addVictimIfNoVictims = () => {
    if (values.Victims.length === 0) {
      addVictim(0);
    }
  };

  const schoolType = localStorage.getItem("schoolType");

  return (
    <>
      <div className="step-container">
        <FieldArray name="Victims">
          {({ push, remove, form: { errors, touched } }) => (
            <>
              <div className={`${height ? "whoVictimWrapper" : ""}`}>
                <div className="whoVictimContainer">
                  <TranslationComponent
                    keys={["are_you_victim"]}
                    school={schoolType}
                    className="step-heading"
                  />
                  <div className="flex items-center gap-5 flex-wrap">
                    <RadioButton
                      name="victimSelf"
                      value="yes"
                      onChange={(e) => {
                        handleChange("victimSelf", e);
                        handleRemoveVictim(0);
                      }}
                    />
                    <RadioButton
                      name="victimSelf"
                      value="no"
                      onChange={(e) => {
                        handleChange("victimSelf", e);
                        addVictimIfNoVictims();
                        setHeight(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              {values.Victims.map((victim, index) => {
                let errorMsgs = null;
                if (
                  errors.Victims &&
                  errors.Victims[index] &&
                  touched.Victims &&
                  touched.Victims[index]
                ) {
                  errorMsgs = {
                    Firstname: touched.Victims[index]?.Firstname
                      ? errors.Victims[index].Firstname
                      : null,
                    Lastname: touched.Victims[index]?.Lastname
                      ? errors.Victims[index].Lastname
                      : null,
                    Gender: touched.Victims[index]?.Gender
                      ? errors.Victims[index].Gender
                      : null,
                    Group: touched.Victims[index]?.Group
                      ? errors.Victims[index].Group
                      : null,
                  };
                }
                return (
                  <div key={index} className="mb-3 more-victims-div mt-5">
                    <p className="victim-heading font-bold mb-3">
                      <TranslationComponent
                        keys={["victim"]}
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
                        name={`Victims.${index}.Firstname`}
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
                        name={`Victims.${index}.Lastname`}
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
                          name={`Victims.${index}.Gender`}
                          value="male"
                          onChange={(e) => handleChange3("Gender", index, e)}
                        />
                        <RadioButton
                          name={`Victims.${index}.Gender`}
                          value="female"
                          onChange={(e) => handleChange3("Gender", index, e)}
                        />
                        <RadioButton
                          name={`Victims.${index}.Gender`}
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
                      <ClassesDropdown name={`Victims.${index}.Group`} />
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
                        onClick={() => handleRemoveVictim(index)}
                      >
                        <TranslationComponent
                          keys={["remove_victim"]}
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
                    addVictim();
                  }}
                >
                  <TranslationComponent
                    keys={["add_victim"]}
                    school={schoolType}
                  />
                </button>
              </div>
            </>
          )}
        </FieldArray>
        {/* <ErrorMessage name="Victims" component="div" className="error" /> */}
      </div>
    </>
  );
};

export default Step3;
