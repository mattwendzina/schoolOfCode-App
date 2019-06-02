import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../config";
import css from "./BootcamperSchedule.module.css";
import ArrowImage from "../../Images/arrow.png";

// get last 5 days schedule || most recent schedule and the 5 days previous
// display Day name at the top..
// display daysContent in the Carousel => lesson num, title
// on click show content and resources && a back button to go back to the schedule view

const defaultDateData = {
  daysContent: [
    {
      sessionTimes: "No Upload reources for this date",
      contentTitle: "",
      learningObjectives: "Please check back later"
    }
  ]
};

const BootcamperSchedule = () => {
  const todaysDate = moment().format("DD/MM/YYYY");
  const [selectedDate, setSelectedDate] = useState(todaysDate);
  // const [fullScheduleData, setFullScheduleData] = useContext(Store);
  const [scheduleData, setScheduleData] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [dateToShow, setDateToShow] = useState([]);

  useEffect(() => {
    async function fetchSchedule() {
      console.log(`${api.schedule}/${selectedDate}`);
      const response = await fetch(`${api.schedule}/${selectedDate}`);
      const data = await response.json();
      console.log("scheduleData get request", data);
      console.log(data.result);
      // add error handling for if it isn't found
      if (data.result === null) {
        setDateToShow([
          {
            date: selectedDate,
            daysContent: defaultDateData.daysContent
          }
        ]);
        // need to set a default here
        //setScheduleData(initialState);
      } else {
        // if there is a date then set it here
        //setScheduleData([data.result]);
        setDateToShow([data.result]);
      }
    }
    fetchSchedule();
    return fetchSchedule;
  }, [selectedDate]);

  useEffect(() => {
    async function fetchMostRecentSchedule() {
      const response = await fetch(`${api.schedule}/most-recent`);
      const data = await response.json();
      if (data.result === null) {
        return;
      } else {
        console.log("fetch most recent", data);
        console.log("fetch most recent", data.result);
        await setScheduleData([...scheduleData, ...data.result]);
        await setDateToShow([...data.result]);
      }
    }
    fetchMostRecentSchedule();

    return fetchMostRecentSchedule;
  }, []);
  const controlCarousel = num => {
    if (
      sessionIndex + num < 0 ||
      sessionIndex + 3 + num > dateToShow[0].daysContent.length
    ) {
      return;
    } else {
      setSessionIndex(sessionIndex + num);
    }
  };

  const FormatedDate = ({ date, num }) => (
    <div
      onClick={() => {
        setSelectedDate(
          moment(moment(date, "DD/MM/YYYY").add(num, "days")._d).format(
            "DD/MM/YYYY"
          )
        );
      }}
    >
      {moment(moment(date, "DD/MM/YYYY").add(num, "days")._d).format(
        "ddd Do MMM"
      )}
    </div>
  );

  return (
    <>
      {console.log("From BOOTCAMPER SChedule", scheduleData)}
      {console.log("selected date", selectedDate)}
      {console.log("dateToShow", dateToShow)}
      <div className={css.dashboardScheduleContainer}>
        {scheduleData.map(day => (
          // here we display the 5 days
          <div className={css.daysOfWeekContainer}>
            <FormatedDate className={css.dayBox} date={day.date} num={0} />
            <FormatedDate className={css.dayBox} date={day.date} num={-1} />
            <FormatedDate className={css.dayBox} date={day.date} num={-2} />
            <FormatedDate className={css.dayBox} date={day.date} num={-3} />
            <FormatedDate className={css.dayBox} date={day.date} num={-4} />
          </div>
        ))}
        <br />
        <div className={css.carouselContainer}>
          <img
            src={ArrowImage}
            alt="left arrow"
            className={css.leftArrow}
            onClick={() => controlCarousel(-1)}
          />
          {dateToShow.map(day =>
            day.daysContent

              .map((session, idx) => (
                <div className={css.itemContainer}>
                  <b>{`Lesson ${idx + 1}`}</b>
                  <p>{session.contentTitle}</p>
                  <p>{session.learningObjectives}</p>
                </div>
              ))
              .slice(sessionIndex, sessionIndex + 3)
          )}

          <img
            src={ArrowImage}
            alt="right arrow"
            className={css.rightArrow}
            onClick={() => controlCarousel(1)}
          />
        </div>
      </div>
    </>
  );
};

export default BootcamperSchedule;
