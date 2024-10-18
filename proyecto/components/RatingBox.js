// RatingBox.js
import React from 'react';

const RatingBox = ({ name, rating }) => {
  return (
    <div className="rating-box">
      <span className="name">{name}</span>
      <div className="rating-circle">
        <span className="rating">{rating}</span>
      </div>
    </div>
  );
};

export default RatingBox;
