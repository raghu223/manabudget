import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteTransaction } from '../../actions/budgetActions';
import './Budget.css';

const ConfirmationToast = ({ closeToast, onConfirm, id }) => (
  <div>
    <p>Are you sure you want to delete this transaction?</p>
    <button className="confirm-yes-btn" onClick={() => { onConfirm(id); closeToast(); }}>Yes</button>
    <button onClick={closeToast}>No</button>
  </div>
);

const Transaction = ({ transaction }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    toast(<ConfirmationToast onConfirm={() => dispatch(deleteTransaction(transaction.id))} id={transaction.id} />);
  };

  const sign = transaction.amount < 0 ? '-' : '+';
  return (
    <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
      {transaction.text}
      <span>
        {sign}₹{Math.abs(transaction.amount).toFixed(2)}
      </span>
      <button onClick={handleDelete} className="delete-btn">x</button>
    </li>
  );
};

const TransactionList = () => {
  const { income, expenses } = useSelector((state) => state.budget);

  return (
    <>
      <h3>History</h3>
      <ul className="list">
        <h4>Income</h4>
        {income.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))}
      </ul>
      <ul className="list">
        <h4>Expenses</h4>
        {expenses.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};

export default TransactionList;
