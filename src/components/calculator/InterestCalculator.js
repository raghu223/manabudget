import React, { useState } from 'react';
import './InterestCalculator.css';

const InterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interestType, setInterestType] = useState('Simple');
  const [compoundingFrequency, setCompoundingFrequency] = useState('Annually');
  const [result, setResult] = useState(null);

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setResult({ error: 'Please enter valid numbers for all fields.' });
      return;
    }

    let interest = 0;
    let totalAmount = 0;

    if (interestType === 'Simple') {
      interest = p * r * t;
      totalAmount = p + interest;
    } else {
      const n = {
        'Annually': 1,
        'Half-Yearly': 2,
        'Quarterly': 4,
        'Monthly': 12,
      }[compoundingFrequency];

      totalAmount = p * Math.pow(1 + r / n, n * t);
      interest = totalAmount - p;
    }

    setResult({
      principal: p,
      interest: interest,
      totalAmount: totalAmount,
    });
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setInterestType('Simple');
    setCompoundingFrequency('Annually');
    setResult(null);
  };

  return (
    <div className="interest-calculator-container">
      <h3>Interest Calculator</h3>
      <div className="calculator-form">
        <div className="form-group">
          <label>Principal Amount</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter principal amount"
          />
        </div>
        <div className="form-group">
          <label>Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter annual rate"
          />
        </div>
        <div className="form-group">
          <label>Time (in years)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Enter time in years"
          />
        </div>
        <div className="form-group">
          <label>Interest Type</label>
          <select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
            <option value="Simple">Simple</option>
            <option value="Compound">Compound</option>
          </select>
        </div>
        {interestType === 'Compound' && (
          <div className="form-group">
            <label>Compounding Frequency</label>
            <select value={compoundingFrequency} onChange={(e) => setCompoundingFrequency(e.target.value)}>
              <option value="Annually">Annually</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        )}
        <div className="calculator-buttons">
            <button onClick={calculateInterest}>Calculate</button>
            <button onClick={handleReset} className="reset-button">Reset</button>
        </div>
      </div>

      {result && (
        <div className="calculator-result">
          <h4>Calculation Result</h4>
          {result.error ? (
            <p className="error-message">{result.error}</p>
          ) : (
            <div>
              <p><strong>Principal:</strong> ₹{result.principal.toFixed(2)}</p>
              <p><strong>Interest Earned:</strong> ₹{result.interest.toFixed(2)}</p>
              <p><strong>Total Amount:</strong> ₹{result.totalAmount.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
