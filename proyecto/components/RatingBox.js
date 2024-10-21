import React from 'react';

const RatingBox = ({ name, rating }) => {
  return (
    <div className="card">
      <div className="content">
        <p className="heading">{name}</p>
        <p className="rating">{rating}</p>
      </div>
    </div>
  );
};

export default RatingBox;
