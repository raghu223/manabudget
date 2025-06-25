import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../actions/budgetActions';
import './Budget.css';

const TransactionForm = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.id);

  const onSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      userId,
      text,
      amount: +amount,
    };

    dispatch(addTransaction(newTransaction));

    setText('');
    setAmount(0);
  };

  return (
    <>
      <h3>Add new transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative - expense, positive - income)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
          />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </>
  );
};

export default TransactionForm;
