import React, { useState } from 'react';

const EntryCounter = ({ entradaId, discoteca, entradaName, onCountChange }) => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      if (onCountChange) onCountChange(newCount);
      return newCount;
    });
  };

  const decrementCount = () => {
    setCount(prevCount => {
      const newCount = prevCount > 0 ? prevCount - 1 : 0;
      if (onCountChange) onCountChange(newCount);
      return newCount;
    });
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
