import React, { useState, useEffect, useReducer } from "react";
import FeedbackTray from "../FeedbackTray";
import DashboardBanner from "../DashboardBanner";
import { api } from "../../config";
import UserName from "../UserName";
import Rating from "react-rating";
import css from "./VideoRating.module.css";
import { Spring } from "react-spring/renderprops";
import { useTransition, animated } from "react-spring";
import close from "../../Images/error.png";
// TODO

// add questions
// number of pending applications
// force to rate before next question

const VideoRating = props => {
  // Set currentUid to starting state of 'undefined' to facilitate the first <ul> to work
  const [currentUid, setCurrentUid] = useState(undefined);
  const [adminFeedbackRating, setAdminFeedbackRating] = useState(0);
  // const [adminFeedbackComment, setAdminFeedbackComment] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [collateFeedback, setCollateFeedback] = useState([]);
  const [pendingVideosData, setPendingVideosData] = useState([]);
  const [acceptedVideosData, setAcceptedVideosData] = useState([]);
  const [rejectedVideosData, setRejectedVideosData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [videoCounter, setVideoCounter] = useState(0);
  const [applicantCounter, setApplicantCounter] = useState(0);
  const [sliderPassValue, setSliderPassValue] = useState(6);
  const [showSpecificApplication, setShowSpecificApplication] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [showApplicants, dispatch] = useReducer((state, action, e) => {
    switch (action) {
      case "pending":
        return state === "pending" ? null : "pending";
      case true:
        return state === true ? null : true;
      case false:
        return state === false ? null : false;
      default:
        return state;
    }
  }, null);

  const transitions = useTransition(
    userInfo,
    Object.keys(userInfo).map(item => userInfo[item].result._id),
    {
      from: {
        transform: "scale(0)"
      },
      enter: {
        transform: "scale(1)"
      },
      leave: {
        transform: "scale(0)"
      },
      config: { duration: 1000 }
    }
  );

  const videoQuestions = [
    { question: "Tell us about yourself" },
    { question: "Why do you want to learn to code?" },
    { question: "What drives you?" },
    { question: "Why do you want to join School of Code?" },
    { question: "Explain something complex in simple terms" }
  ];
  // GET in videos from APPLICATIONS for each applicant based on uid which have a status 'pending'

  // Removed Score from inside of AverageScore Component so it can be accessed globally (for the thankyou message when they've submitted their review)

  const getAverageScore = () => {
    let score = 0;
    collateFeedback.map(item => (score += item.rating));
    return score / 2 / collateFeedback.length;
  };

  const getCorrectApplicantIndex = uid => {
    setApplicantCounter(
      [
        ...pendingVideosData,
        ...acceptedVideosData,
        ...rejectedVideosData
      ].findIndex(item => uid === item.firebaseUid)
    );
  };

  const AverageScore = () => {
    const calculatedScore = getAverageScore();
    return (
      <div className={css.overallRating}>
        <h3>Overall Rating</h3>
        <div className={css.ratingTitleContainer}>
          <Rating
            initialRating={calculatedScore}
            emptySymbol="fa fa-star-o fa-2x"
            fullSymbol="fa fa-star fa-2x"
            style={{ color: "rgba(248, 180, 22, 1)" }}
            fractions={2}
            readonly
          />
        </div>
      </div>
    );
  };

  const calculateOverallRating = () =>
    collateFeedback
      .map(item => item.rating)
      .reduce((accumulator, currentValue) => accumulator + currentValue) /
    collateFeedback.length;

  const goToHome = () => {
    props.history.push(`/admin-dashboard`);
  };

  const postRatingsToServer = async () => {
    await fetch(`${api.applications}/admin-video-descion`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        applicantFirebaseUid: currentUid,
        videoApplicationData: collateFeedback,
        videoOverallRating: overallRating,
        passVideoStage: overallRating >= sliderPassValue ? true : false
      })
    });
    await setRefreshData(!refreshData);
  };
  const updatePassStage = async updatedRatings => {
    return await fetch(`${api.applications}/admin-video-descion-update-many`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        ratingsData: [...updatedRatings]
      })
    });
  };

  const getUserInfo = data => {
    const { firebaseUid } = data;
    return fetch(`${api.users}/${firebaseUid}`)
      .then(res => res.json())
      .then(json => {
        return json;
      });
  };

  const viewApplication = id => {
    setCurrentUid(id);
    // showSpecificApplication
    //   ? setShowSpecificApplication(null)
    setShowSpecificApplication([id]);
  };

  const getVideos = async () => {
    const pendingResponse = await fetch(
      `${api.applications}/make-descion-videos/pending`
    );
    const pendingData = await pendingResponse.json();

    // map over this array on the back end and send all the relevant info back
    await setPendingVideosData(pendingData.result);

    const acceptedResponse = await fetch(
      `${api.applications}/make-descion-videos/accepted`
    );
    const acceptedData = await acceptedResponse.json();

    // map over this array on the back end and send all the relevant info back
    await setAcceptedVideosData(acceptedData.result);

    const rejectedResponse = await fetch(
      `${api.applications}/make-descion-videos/rejected`
    );
    const rejectedData = await rejectedResponse.json();

    // map over this array on the back end and send all the relevant info back
    await setRejectedVideosData(rejectedData.result);
  };

  useEffect(() => {
    getVideos();
  }, [refreshData]);

  useEffect(() => {
    // go through accepted and rejected arrays and change the relevant data
    let updatedAccepted = acceptedVideosData.slice().map(user => {
      user.passVideoStage =
        user.videoOverallRating >= sliderPassValue ? true : false;
      return user;
    });
    let updatedRejected = rejectedVideosData.slice().map((user, indx) => {
      user.passVideoStage =
        user.videoOverallRating >= sliderPassValue ? true : false;
      return user;
    });
    updatePassStage([...updatedAccepted, ...updatedRejected]);

    setAcceptedVideosData(
      [...updatedAccepted, ...updatedRejected].filter(
        user => user.passVideoStage
      )
    );
    setRejectedVideosData(
      [...updatedAccepted, ...updatedRejected].filter(
        user => !user.passVideoStage
      )
    );

    // go through both of the new accepted and reject and post the to them server
  }, [sliderPassValue]);

  useEffect(() => {
    if (collateFeedback.length > 3) {
      setOverallRating(calculateOverallRating());

      if (collateFeedback.length === 5) {
        postRatingsToServer();
      }
    }
  }, [collateFeedback]);

  useEffect(() => {
    const grabAll = () =>
      Promise.all(
        [
          ...pendingVideosData,
          ...acceptedVideosData,
          ...rejectedVideosData
        ].map(getUserInfo)
      ).then(users => {
        setUserInfo(
          users.filter(user => user && user.result && user.result._id)
        );
      });
    grabAll();
  }, [pendingVideosData, rejectedVideosData, acceptedVideosData]);

  return (
    <>
      <DashboardBanner title={"Video Applications"} />
      <div id="userTray" className={css.userTray}>
        <div className={css.passThresholdContainer}>
          <p> Pass Threshold </p>
          <Rating
            initialRating={sliderPassValue / 2}
            emptySymbol="fa fa-star-o fa-2x"
            fullSymbol="fa fa-star fa-2x"
            style={{ color: "#11cf84" }}
            fractions={2}
            onClick={value => {
              setSliderPassValue(value * 2);
            }}
          />
        </div>
        <div id="videoTray">
          {[
            ...pendingVideosData,
            ...acceptedVideosData,
            ...rejectedVideosData
          ].map(({ videoApplicationData, firebaseUid }, applicantIndex) => {
            console.log("FIREBASE UID FROM TOP", firebaseUid);
            console.log("applicant counter", applicantCounter);
            if (applicantIndex === applicantCounter) {
              return (
                <>
                  <div
                    key={applicantIndex}
                    className={css.applicationStatusContainer}
                  >
                    <div>
                      <button
                        className={
                          showApplicants === false
                            ? css.applicationStatusButtonActive
                            : css.applicationStatusButton
                        }
                        onClick={() => {
                          dispatch(false);
                          viewApplication();
                        }}
                      >
                        <p> Rejected Applications</p>
                        <Spring
                          from={{ number: 0 }}
                          to={{
                            number: rejectedVideosData.filter(
                              applicant => applicant.passVideoStage === false
                            ).length
                          }}
                          config={{ duration: 500 }}
                        >
                          {props => (
                            <p className={css.applicationsNumber}>
                              {props.number.toFixed()}
                            </p>
                          )}
                        </Spring>
                      </button>
                      {showApplicants === null && currentUid === undefined ? (
                        <ul className={css.instructionsMessage}>
                          <h3>
                            {" "}
                            Select "Pending Applications" to begin rating <br />{" "}
                            or <br /> Adjust Pass Threshold to set the
                            acceptance rate.{" "}
                          </h3>{" "}
                        </ul>
                      ) : null}

                      <ul
                        className={
                          showApplicants === false
                            ? css.applicantListContainer
                            : css.hideApplicantListContainer
                        }
                      >
                        {/* List all applicants, unless the search input is used  */}
                        {rejectedVideosData.map(
                          (applicant, rejectedApplicationIndex) => {
                            return (
                              <>
                                <UserName
                                  classToBe={css.applicant}
                                  click={e =>
                                    viewApplication(applicant.firebaseUid)
                                  }
                                  indexKey={applicant.firebaseUid}
                                  uid={applicant.firebaseUid}
                                  dispatch={() => dispatch(false)}
                                  setAdminFeedbackRating={
                                    setAdminFeedbackRating
                                  }
                                  setVideoCounter={setVideoCounter}
                                  setCollateFeedback={setCollateFeedback}
                                  applicantCounter={() =>
                                    getCorrectApplicantIndex(
                                      applicant.firebaseUid
                                    )
                                  }
                                />
                              </>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div>
                      <button
                        className={
                          showApplicants === "pending"
                            ? css.applicationStatusButtonActive
                            : css.applicationStatusButton
                        }
                        onClick={() => {
                          dispatch("pending");
                          viewApplication();
                        }}
                      >
                        <p> Pending Applications</p>
                        <p className={css.applicationsNumber}>
                          {
                            pendingVideosData.filter(
                              applicant =>
                                applicant.passVideoStage === "pending"
                            ).length
                          }
                        </p>
                      </button>
                      <ul
                        className={
                          showApplicants === "pending"
                            ? css.applicantListContainer
                            : css.hideApplicantListContainer
                        }
                      >
                        {/* List all applicants, unless the search input is used  */}
                        {pendingVideosData.map(
                          (applicant, pendingApplicationIndex) => {
                            return (
                              <>
                                <UserName
                                  classToBe={css.applicant}
                                  click={e =>
                                    viewApplication(applicant.firebaseUid)
                                  }
                                  indexKey={applicant.firebaseUid}
                                  uid={applicant.firebaseUid}
                                  applicantCounter={() =>
                                    getCorrectApplicantIndex(
                                      applicant.firebaseUid
                                    )
                                  }
                                  dispatch={() => dispatch("pending")}
                                  setAdminFeedbackRating={
                                    setAdminFeedbackRating
                                  }
                                  setVideoCounter={setVideoCounter}
                                  setCollateFeedback={setCollateFeedback}
                                />
                              </>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div>
                      <button
                        className={
                          showApplicants === true
                            ? css.applicationStatusButtonActive
                            : css.applicationStatusButton
                        }
                        onClick={() => {
                          dispatch(true);
                          viewApplication();
                        }}
                      >
                        <p> Accepted Applications</p>
                        <Spring
                          from={{
                            number: 0
                          }}
                          to={{
                            number: acceptedVideosData.filter(
                              applicant => applicant.passVideoStage === true
                            ).length
                          }}
                          config={{ duration: 500 }}
                        >
                          {props => (
                            <p className={css.applicationsNumber}>
                              {props.number.toFixed()}
                              {props.secondNumber}
                            </p>
                          )}
                        </Spring>
                      </button>
                      <ul
                        className={
                          showApplicants === true
                            ? css.applicantListContainer
                            : css.hideApplicantListContainer
                        }
                      >
                        {/* List all applicants, unless the search input is used  */}
                        {acceptedVideosData.map(
                          (applicant, acceptedApplicationIndex) => {
                            return (
                              <>
                                <UserName
                                  classToBe={css.applicant}
                                  click={e =>
                                    viewApplication(applicant.firebaseUid)
                                  }
                                  indexKey={applicant.firebaseUid}
                                  uid={applicant.firebaseUid}
                                  dispatch={() => dispatch(true)}
                                  setAdminFeedbackRating={
                                    setAdminFeedbackRating
                                  }
                                  setVideoCounter={setVideoCounter}
                                  setCollateFeedback={setCollateFeedback}
                                  applicantCounter={() =>
                                    getCorrectApplicantIndex(
                                      applicant.firebaseUid
                                    )
                                  }
                                />
                              </>
                            );
                          }
                        )}
                      </ul>
                      <div
                        onClick={goToHome}
                        className={css.adminDashboardHome}
                      >
                        <button> Admin Home</button>
                      </div>
                    </div>
                  </div>
                  {videoApplicationData.length === 0 && (
                    <p>no video application data for: {firebaseUid} </p>
                  )}
                  {videoApplicationData.map(({ videoUrl }, videoIndex) => {
                    console.log("FIREBASEID", firebaseUid);
                    console.log("VIDEO APPLICATION DATA", videoApplicationData);
                    console.log("VIDEO INDEX", videoIndex);
                    console.log(
                      "showSpecificApplication",
                      showSpecificApplication[0]
                    );
                    console.log("USER INFO", userInfo);
                    if (
                      showSpecificApplication.length > 0 &&
                      firebaseUid === showSpecificApplication[0] &&
                      videoIndex === videoCounter
                    ) {
                      return (
                        <>
                          {userInfo &&
                            transitions.map(({ item, props, key }, idx) => {
                              if (applicantIndex === idx) {
                                return (
                                  <>
                                    <animated.div key={key} style={props}>
                                      <div
                                        className={css.videoRatingsContainer}
                                      >
                                        <div className={css.detailsContainer}>
                                          <div className={css.metaData}>
                                            {collateFeedback.length === 0 ? (
                                              <div
                                                className={css.overallRating}
                                              >
                                                <h2>
                                                  {item.result.firstName}{" "}
                                                  {item.result.lastName}
                                                </h2>
                                                <h2
                                                  style={{ fontSize: "25px" }}
                                                >
                                                  Overall Rating
                                                </h2>
                                                <div
                                                  className={
                                                    css.ratingTitleContainer
                                                  }
                                                >
                                                  <Rating
                                                    initialRating={0}
                                                    emptySymbol="fa fa-star-o fa-2x"
                                                    fullSymbol="fa fa-star fa-2x"
                                                    style={{
                                                      color:
                                                        "rgba(248, 180, 22, 1)",
                                                      fontSize: "22px"
                                                    }}
                                                    fractions={2}
                                                    readonly
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <AverageScore
                                                collateFeedback={
                                                  collateFeedback
                                                }
                                              />
                                            )}
                                          </div>
                                        </div>
                                        <div className={css.videosContainer}>
                                          <h2>
                                            {videoCounter + 1}/5:{" "}
                                            {
                                              videoQuestions[videoCounter]
                                                .question
                                            }
                                          </h2>
                                          <video
                                            className={css.videoPlayer}
                                            controls
                                            src={videoUrl}
                                          />
                                          <div
                                            className={
                                              css.toggleVideosContainer
                                            }
                                          >
                                            {/* <button
                                              className={
                                                css.toggleVideosContainer
                                              }
                                              onClick={() => {
                                                viewApplication();
                                                setAdminFeedbackRating(0);
                                                setVideoCounter(0);
                                                setCollateFeedback([]);
                                              }}
                                            >
                                              <p> Cancel </p>
                                            </button> */}
                                          </div>
                                        </div>
                                        <div
                                          className={css.rateVideosContainer}
                                        >
                                          <FeedbackTray
                                            key={key}
                                            adminFeedbackRating={
                                              adminFeedbackRating
                                            }
                                            setAdminFeedbackRating={
                                              setAdminFeedbackRating
                                            }
                                            videoCounter={videoCounter}
                                            setVideoCounter={setVideoCounter}
                                            collateFeedback={collateFeedback}
                                            setCollateFeedback={
                                              setCollateFeedback
                                            }
                                            videoUrl={videoUrl}
                                            // setAdminFeedbackComment={
                                            //   setAdminFeedbackComment
                                            // }
                                            videoApplicationData={
                                              videoApplicationData
                                            }
                                          />
                                        </div>
                                      </div>
                                    </animated.div>
                                  </>
                                );
                              } else {
                                return;
                              }
                            })}
                        </>
                      );
                    } else if (collateFeedback.length === 5) {
                      return videoIndex === 4
                        ? transitions.map(({ item, key, props }, idx) => {
                            return applicantIndex === idx ? (
                              <div className={css.thankyouContainer}>
                                <h3> Thank you </h3>
                                <p>
                                  Your final score of {getAverageScore()} has
                                  been submitted
                                </p>
                                <img
                                  src={close}
                                  alt="close button"
                                  onClick={() => {
                                    setCollateFeedback([]);
                                  }}
                                />
                              </div>
                            ) : null;
                          })
                        : null;
                    } else {
                      return;
                    }
                  })}
                </>
              );
            } else {
              return;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default VideoRating;
