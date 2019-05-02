import React, { useState } from "react";
import css from "./AdminPage.module.css";

const AdminPage = () => {
  // ability to upload schedule

  // a way to add several links
  // a way to review schedule
  // a way to upload video
  // a way to upload files
  // send all the info up to the App
  // progress bar to whilst uploading

  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");

  const formHandler = event => {
    console.log("do something with the stored state");
    console.log("session time", selectedTime);
    console.log("session title", sessionTitle);
    event.preventDefault();
  };

  return (
    <form onSubmit={event => formHandler(event)}>
      <fieldset>
        <legend>Session Information:</legend>
        <select
          id={css.sessionTimes}
          value={selectedTime}
          onChange={event => setSelectedTime(event.target.value)}
        >
          <option selected value="09.00 - 10.00">
            09.00 - 10.00
          </option>
          <option value="10.00 - 11.00">10.00 - 11.00</option>
          <option value="11.00 - 12.00">11.00 - 12.00</option>
          <option value="13.00 - 14.00">13.00 - 14.00</option>
          <option value="14.00 - 15.00">14.00 - 15.00</option>
          <option value="15.00 - 16.00">15.00 - 16.00</option>
          <option value="16.00 - 17.00">16.00 - 17.00</option>
        </select>
        <input
          type="text"
          name="sessionTitle"
          placeholder="Session title"
          onChange={event => setSessionTitle(event.target.value)}
        />
        <input type="submit" value="Submit" />
      </fieldset>
    </form>
  );
};

export default AdminPage;
