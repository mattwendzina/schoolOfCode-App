import React from "react";
import { Link } from "react-router-dom";
import css from "../NavBar/NavBar.module.css";
import HomeIcon from "../../Images/home.svg";
import CalendarIcon from "../../Images/calendar.svg";
import GlassesIcon from "../../Images/glasses.svg";
import EducationIcon from "../../Images/education.svg";
import NotebookIcon from "../../Images/notebook.svg";

function NavBar() {
  return (
    <>
      <nav className={css.navContainer}>
        <div className={css.iconsContainer}>
          <div>
            <Link to="/">
              <img className={css.homeIcon} src={HomeIcon} alt="home icon" />
            </Link>
          </div>
          <div>
            <Link to="/schedule">
              <img
                className={css.calendarIcon}
                src={CalendarIcon}
                alt="calendar icon"
              />
            </Link>
          </div>
          <div>
            <Link to="/links">
              <img
                className={css.glassesIcon}
                src={GlassesIcon}
                alt="glasses icon"
              />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
