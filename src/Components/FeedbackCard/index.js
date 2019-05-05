import React from "react";
import Paper from "@material-ui/core/Paper";
import Rating from "react-rating";
const FeedbackCard = ({ item, update }) => {
  return (
    <>
      <Paper>
        <>{item.title}</>
        <br />
        <Rating
          initialRating={item.rating / 2}
          emptySymbol="fa fa-star-o fa-2x"
          fullSymbol="fa fa-star fa-2x"
          style={{ color: "rgba(248, 180, 22, 1)" }}
          fractions={2}
          onClick={value => update(item.title, value)}
        />
      </Paper>
    </>
  );
};

export default FeedbackCard;
