import React, { Component } from "react";
import ArrowImage from "../../Images/right-arrow.svg";
import css from "../DashboardScheduleCarousel/DashboardScheduleCarousel.module.css";
class DashboardScheduleCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  nextButton = () => {
    this.setState(state => {
      return {
        counter: state.counter + 1
      };
    });
  };
  previousButton = () => {
    this.setState(state => {
      return {
        counter: state.counter - 1
      };
    });
  };

  array = ["Functions", "React", "Google Analytics", "CSS", "Node", "Hooks"];
  render() {
    return (
      <>
        <div className={css.carouselContainer}>
          <img
            src={ArrowImage}
            alt="arrow"
            className={css.leftArrow}
            onClick={this.previousButton}
          />
          <div className={css.itemOne}>{this.array[this.state.counter]}</div>
          <div className={css.itemTwo}>
            {this.array[this.state.counter + 1]}
          </div>
          <div className={css.itemThree}>
            {this.array[this.state.counter + 2]}
          </div>

          <img
            src={ArrowImage}
            alt="arrow"
            className={css.rightArrow}
            onClick={this.nextButton}
          />
        </div>
      </>
    );
  }
}
export default DashboardScheduleCarousel;
