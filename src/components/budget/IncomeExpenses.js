import React from 'react';
import { useSelector } from 'react-redux';
import './Budget.css';

const IncomeExpenses = () => {
  const { income, expenses } = useSelector((state) => state.budget);

  const totalIncome = income
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);
  const totalExpenses = expenses
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);

  return (
    <div className="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p className="money plus">+₹{totalIncome}</p>
      </div>
      <div>
        <h4>Expense</h4>
        <p className="money minus">-₹{Math.abs(totalExpenses)}</p>
      </div>
    </div>
  );
};

export default IncomeExpenses;
