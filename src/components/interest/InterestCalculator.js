import React, { useState } from 'react';
import './InterestCalculator.css';

const InterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState(null);

  const calculateInterest = (e) => {
    e.preventDefault();

    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      return;
    }

    // Simple Interest
    const simpleInterest = p * r * t;
    const simpleInterestTotal = p + simpleInterest;

    setResults({
      simpleInterest: simpleInterest.toFixed(2),
      simpleInterestTotal: simpleInterestTotal.toFixed(2),
    });
  };

  return (
    <div className="interest-calculator">
      <h3>Interest Calculator</h3>
      <form onSubmit={calculateInterest}>
        <div>
          <label>Principal Amount ($):</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Annual Interest Rate (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Time Period (Years):</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {results && (
        <div className="results">
          <h4>Results</h4>
          <h5>Simple Interest</h5>
          <p>Interest Earned: ${results.simpleInterest}</p>
          <p>Total Value: ${results.simpleInterestTotal}</p>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
