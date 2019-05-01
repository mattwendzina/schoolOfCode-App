import React, { useState, useEffect } from "react";
import StudentPage from "../StudentPage/index";
import "./App.css";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

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
  },
  {
    date: "1/5/2019",
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
    date: "2/5/2019",
    daysContent: [
      {
        sessionTimes: "09.00 - 10.00",
        contentTitle: "Code Wars",
        contentURL: ""
      },
      {
        sessionTimes: "13.00 - 14.00",
        contentTitle: "React Hooks",
        contentURL: ""
      },
      {
        sessionTimes: "15.00 - 16.00",
        contentTitle: "React useContext()",
        contentURL: "https://reactjs.org/docs/components-and-props.html"
      }
    ]
  },
  {
    date: "27/4/2019",
    daysContent: [
      {
        sessionTimes: "",
        contentTitle: "",
        contentURL: ""
      }
    ]
  },
  {
    date: "26/4/2019",
    daysContent: [
      {
        sessionTimes: "",
        contentTitle: "",
        contentURL: ""
      }
    ]
  }
];

firebase.initializeApp({
  apiKey: "AIzaSyBEjVPCQzoKZxg-YCv3Pno_X4Ek1MtOqQw",
  authDomain: "what-did-i-miss-88f32.firebaseapp.com"
});
function App() {
  const [signedIn, setSignedIn] = useState(false);
  const d = new Date();
  const todaysDate =
    d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  const [selectedDate, setSelectedDate] = useState(todaysDate);
  // function to find the selected date from allContent
  const contentToBeDisplayed = allContent.find(
    obj => obj.date === selectedDate
  );

  // buttons to toggle date
  const changeDate = num => {
    console.log(selectedDate);
    console.log(d.getDate());
    console.log(num);
    return setSelectedDate(
      d.getDate() + num + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    );
  };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setSignedIn(!!user); // not not meaning if the user is an object it will revert to true and if it isn't an object it will revert to false
      console.log("user", user);
      console.log("uid", user.uid);
    });
  }, []);

  return (
    <>
      {!signedIn ? (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : (
        <div className="App">
          <h1>
            Welcome, {firebase.auth().currentUser.displayName}
            <img
              alt="profile pic"
              src={firebase.auth().currentUser.photoURL}
              style={{ width: "5vh", height: "5vh", borderRadius: "100%" }}
            />
          </h1>
          <button
            onClick={() => {
              firebase.auth().signOut();
            }}
          >
            Sign Out
          </button>
          Schedule
          <button onClick={() => changeDate(-1)}>&lt;</button>
          <button onClick={() => changeDate(1)}>&gt;</button>
          <StudentPage props={contentToBeDisplayed} />
        </div>
      )}
    </>
  );
}

export default App;
