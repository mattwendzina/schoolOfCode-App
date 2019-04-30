import React from "react";
//import css from "./index.module.css";
import { Timeline, TimelineEvent } from "react-event-timeline";

const StudentPage = ({ props }) => {
  // display the schedule
  // dynamically add the relevant timings and number of points

  return (
    <>
      <div>{props.date}</div>
      <Timeline>
        {props.daysContent.map(item => (
          <TimelineEvent title={item.sessionTimes}>
            {item.contentURL !== "" ? (
              <div>
                {item.contentTitle}
                <br />
                <a href={item.contentURL}>{item.contentURL}</a>
              </div>
            ) : (
              <div>{item.contentTitle}</div>
            )}
          </TimelineEvent>
        ))}
      </Timeline>
    </>
  );
};

{
  /* <TimelineEvent title="10.00 - 11.00">
JavaScript Fat Arrows
</TimelineEvent>
<TimelineEvent title="11.00 - 12.00">HTML Accessibility</TimelineEvent>
<TimelineEvent title="13.00 - 14.00">AWS serverless</TimelineEvent>
<TimelineEvent title="14.00 - 15.00">REST API</TimelineEvent>
<TimelineEvent title="15.00 - 16.00">React</TimelineEvent>
<TimelineEvent title="16.00 - 17.00">React useContext()</TimelineEvent> */
}

export default StudentPage;
