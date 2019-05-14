import React from "react";

const FormPart1 = ({
  step,
  setStep,
  formValues,
  setFormValues,
  formError,
  setFormError
}) => {
  const saveAndContinue = e => {
    e.preventDefault();
    if (
      formValues.firstName === "" ||
      formValues.lastName === "" ||
      formValues.email === ""
    ) {
      setFormError({
        ...formError,
        inputError: "Please complete all the fields"
      });
      return;
    } else if (
      !formValues.email.includes("@") ||
      !formValues.email.includes(".")
    ) {
      setFormError({
        ...formError,
        emailError: "Please enter a valid email address",
        inputError: ""
      });
      return;
    }
    setFormError({
      ...formError,
      inputError: "",
      emailError: ""
    });
    setStep(step + 1);
  };

  const updateField = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          onChange={updateField}
          defaultValue={formValues.firstName}
          required
        />
      </div>

      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          onChange={updateField}
          defaultValue={formValues.lastName}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={updateField}
          defaultValue={formValues.email}
          required
        />
      </div>
      <div style={{ color: "red", fontSize: 12 }}> {formError.inputError}</div>
      <div style={{ color: "red", fontSize: 12 }}> {formError.emailError}</div>

      <button onClick={saveAndContinue}> Save and Continue </button>
    </>
  );
};

export default FormPart1;