import React, { useState } from 'react';

const EntryCounter = ({ entradaId, entradaName, onCountChange }) => {
  const [count, setCount] = useState(0);
  const [hasSeguro, setHasSeguro] = useState(false);

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
  
  const handleSeguroChange = (e) => {
    const isChecked = e.target.checked;
    setHasSeguro(isChecked);
    onCountChange(entradaId, count, isChecked);
  };


  return (
    <div className="card">
      <div className="content">
        <p className="heading">{entradaName}</p>
        <div className="counter-section">
            <input
              type="checkbox"
              checked={hasSeguro}
              onChange={handleSeguroChange}
            /> Seguro
        </div>
        <div className="counter-section">
        <button className="arrow-button" onClick={incrementCount}>
            ▲
          </button>
          <span className="count-display">{count}</span>
          <button className="arrow-button" onClick={decrementCount} disabled={count === 0}>
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryCounter;
