import React, { useState } from "react";
import StudentPage from "../StudentPage/index";
import "./App.css";

const allContent = [
  {
    date: "30/4/2019",
    daysContent: [
      {
        sessionTimes: "09.00 - 10.00",
        contentTitle: "Code Wars",
        contentURL: ""
      },
      {
        sessionTimes: "10.00 - 11.00",
        contentTitle: "JavaScript Fat Arrows",
        contentURL: ""
      },
      {
        sessionTimes: "13.00 - 14.00",
        contentTitle: "JavaScript async await",
        contentURL: ""
      },
      {
        sessionTimes: "15.00 - 16.00",
        contentTitle: "React functional Components",
        contentURL: "https://reactjs.org/docs/components-and-props.html"
      }
    ]
  },
  {
    date: "29/4/2019",
    daysContent: [
      {
        sessionTimes: "",
        contentTitle: "",
        contentURL: ""
      }
    ]
  },
  {
    date: "28/4/2019",
    daysContent: [
      {
        sessionTimes: "",
        contentTitle: "",
        contentURL: ""
      }
    ]
  }
];

function App() {
  const d = new Date();
  const todaysDate =
    d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  const [selectedDate, setSelectedDate] = useState(todaysDate);
  // function to find the selected date from allContent

  const contentToBeDisplayed = allContent.find(
    obj => obj.date === selectedDate
  );
  return (
    <div className="App">
      Schedule
      <StudentPage props={contentToBeDisplayed} />
    </div>
  );
}

export default App;
