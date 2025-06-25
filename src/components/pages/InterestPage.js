import React from 'react';
import InterestCalculator from '../interest/InterestCalculator';
import InvestmentForm from '../investment/InvestmentForm';
import './InterestPage.css';

const InterestPage = () => {
  return (
    <div className="interest-page-container">
      <div className="interest-calculator-section">
        <InterestCalculator />
      </div>
      <div className="investment-section">
        <InvestmentForm />
      </div>
    </div>
  );
};

export default InterestPage;
