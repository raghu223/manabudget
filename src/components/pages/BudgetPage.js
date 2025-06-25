import React from 'react';
import Balance from '../budget/Balance';
import IncomeExpenses from '../budget/IncomeExpenses';
import TransactionForm from '../budget/TransactionForm';
import TransactionList from '../budget/TransactionList';
import './BudgetPage.css';

const BudgetPage = () => {
  return (
    <div className="budget-container">
      <Balance />
      <IncomeExpenses />
      <TransactionList />
      <TransactionForm />
    </div>
  );
};

export default BudgetPage;
