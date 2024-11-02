import React from 'react';

const StandarButton = ({text, onClick}) => {
  return (
    <button className="standard-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default StandarButton;