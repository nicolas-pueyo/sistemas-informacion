import React, { useState, useCallback } from 'react';

const EntryCounter = ({ entradaId, entradaName, onCountChange }) => {
  const [count, setCount] = useState(0);
  const [hasSeguro, setHasSeguro] = useState(false);

  const updateParent = useCallback((newCount, newHasSeguro) => {
    onCountChange(entradaId, newCount, newHasSeguro);
  }, [entradaId, onCountChange]);

  const incrementCount = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      updateParent(newCount, hasSeguro);
      return newCount;
    });
  };

  const decrementCount = () => {
    setCount(prevCount => {
      const newCount = prevCount > 0 ? prevCount - 1 : 0;
      updateParent(newCount, hasSeguro);
      return newCount;
    });
  };
  
  const handleSeguroChange = (e) => {
    const isChecked = e.target.checked;
    setHasSeguro(isChecked);
    updateParent(count, isChecked);
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
