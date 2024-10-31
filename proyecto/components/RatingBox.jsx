import React from 'react';
import Link from 'next/link';

const RatingBox = ({ name, rating, discoteca }) => {
  return (
    <Link href={`/discoteca/${discoteca}`}>
    <div className="card">
      <div className="content">
        <p className="heading">{name}</p>
        <p className="rating">{rating}</p>
      </div>
    </div>
    </Link>
  );
};

export default RatingBox;
