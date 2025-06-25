import React from 'react';
import { useSelector } from 'react-redux';
import './Budget.css';

const Balance = () => {
  const { balance } = useSelector((state) => state.budget);

  return (
    <div>
      <h4>Your Balance</h4>
      <h1>₹{balance.toFixed(2)}</h1>
    </div>
  );
};

export default Balance;
