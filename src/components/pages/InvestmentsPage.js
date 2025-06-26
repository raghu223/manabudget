import React from 'react';
import InvestmentForm from '../investment/InvestmentForm';
import InterestCalculator from '../calculator/InterestCalculator';
import './InvestmentsPage.css';

const InvestmentsPage = () => {
  return (
    <div className="investments-page-container">
      <div className="investment-form-section">
        <InvestmentForm />
      </div>
      <div className="interest-calculator-section">
        <InterestCalculator />
      </div>
    </div>
  );
};

export default InvestmentsPage;
