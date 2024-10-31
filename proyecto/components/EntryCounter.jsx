import React, { useState } from 'react';

const EntryCounter = ({ entradaId, discoteca, entradaName }) => {
  const [count, setCount] = useState(0);

  // Function to handle increasing the count
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Function to handle decreasing the count
  const decrementCount = () => {
    setCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
  };

  return (
    <div className="card">
      <div className="content">
        <p className="heading">{entradaName}</p>
        <div className="counter-section">
          <button onClick={decrementCount} disabled={count === 0}>
            -
          </button>
          <span>{count}</span>
          <button onClick={incrementCount}>+</button>
        </div>
      </div>
    </div>
  );
};

export default EntryCounter;
