import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculateInterest, deleteInvestment } from '../../actions/investmentActions';
import { toast } from 'react-toastify';
import './InvestmentList.css';

const ConfirmationToast = ({ onConfirm, onCancel, message }) => (
    <div className="confirmation-toast">
      <p>{message}</p>
      <div className="confirmation-buttons">
        <button onClick={onConfirm} className="toast-button-yes">Yes</button>
        <button onClick={onCancel} className="toast-button-no">No</button>
      </div>
    </div>
);

const InvestmentList = () => {
  const investments = useSelector((state) => state.investment.investments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateInterest()); // Calculate interest on initial render or when investments change
    const interval = setInterval(() => {
      dispatch(calculateInterest());
    }, 86400000); // Recalculate interest daily

    return () => clearInterval(interval);
  }, [dispatch, investments.length]); // Re-run when the number of investments changes

  const handleDelete = (id) => {
    const confirmDelete = () => {
        dispatch(deleteInvestment(id));
        toast.dismiss();
        toast.success('Investment deleted successfully!');
    };

    const cancelDelete = () => {
        toast.dismiss();
    };

    toast(<ConfirmationToast onConfirm={confirmDelete} onCancel={cancelDelete} message="Are you sure you want to delete this investment?" />, {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: 'confirmation-toast-container'
    });
  };

  const totalInvestment = investments.reduce((acc, investment) => acc + investment.principal, 0);
  const totalInterest = investments.reduce((acc, investment) => acc + investment.interest, 0);

  return (
    <div className="investment-list-container">
      <h3>Scheduled Investments</h3>
      <ul className="investment-list">
        {investments.map((investment) => {
          const totalAmount = investment.principal + investment.interest;
          return (
            <li key={investment.id} className="investment-item">
              <div>
                <strong>Name:</strong> {investment.name}
              </div>
              <div>
                <strong>Principal:</strong> ₹{investment.principal.toFixed(2)}
              </div>
              <div>
                <strong>Rate:</strong> {investment.rate}% APR
              </div>
              <div>
                <strong>Start Date:</strong> {new Date(investment.startDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Accrued Interest:</strong> ₹{investment.interest.toFixed(2)}
              </div>
              <div>
                <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
              </div>
              <button onClick={() => handleDelete(investment.id)} className="delete-button">Delete</button>
            </li>
          );
        })}
      </ul>
      <div className="investment-summary">
        <h3>Investment Summary</h3>
        <p>Total Investment: ₹{totalInvestment.toFixed(2)}</p>
        <p>Total Interest Earned: ₹{totalInterest.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default InvestmentList;
