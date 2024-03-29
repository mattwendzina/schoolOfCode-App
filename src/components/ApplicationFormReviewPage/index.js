import React from "react";
import css from "../ApplicationFormReviewPage/ApplicationFormReviewPage.module.css";
import SocImage from "../../Images/soc-logo.png";
const ReviewForm = ({ step, setStep, formValues, submitForm }) => {
  const previous = e => {
    e.preventDefault();
    setStep(step - 1);
  };
  return (
    <>
      <div className={css.wrapper}>
        <div className={css.container}>
          <div className={css.leftContainer}>
            <h1 className={css.applicationFormText}>Application Form</h1>
            <div className={css.socImageContainer}>
              <img
                src={SocImage}
                className={css.socImage}
                alt="School of code logo"
              />
            </div>
            {/* <div className={css.instructionsBox}>Instructions</div> */}
            <ol className={css.instructionsContainer}>
              <li>Please complete all five sections of the form.</li>

              <li>
                You will receive an email notifying you the outcome of the first
                stage within a few weeks!
              </li>
            </ol>
          </div>
          <div className={css.rightContainer}>
            <h1 className={css.applicationStepText}>
              Please review your information
            </h1>
            <div className={css.formContainer}>
              <div>
                <ul>
                  {Object.keys(formValues).map(item => (
                    <>
                      {/* <li>{item}</li> */}
                      <li>{formValues[item]}</li>
                    </>
                  ))}
                </ul>
              </div>
            </div>
            <div className={css.buttons}>
              <button onClick={previous} className={css.previousButton}>
                {" "}
                Previous{" "}
              </button>
              <button onClick={() => submitForm()} className={css.submitButton}>
                {" "}
                Submit{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewForm;
