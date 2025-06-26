import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculateInterest, deleteInvestment } from '../../actions/investmentActions';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { exportInvestmentsToExcel } from '../../utils/exportUtils';
import { exportInvestmentsToPDF } from '../../utils/exportPDF';
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

const InvestmentList = ({ investments: propInvestments }) => {
  const reduxInvestments = useSelector((state) => state.investment.investments);
  const investments = propInvestments || reduxInvestments;
  const isSample = !!propInvestments;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSample) {
      dispatch(calculateInterest()); // Calculate interest on initial render or when investments change
      const interval = setInterval(() => {
        dispatch(calculateInterest());
      }, 86400000); // Recalculate interest daily

      return () => clearInterval(interval);
    }
  }, [dispatch, reduxInvestments.length, isSample]); // Re-run when the number of investments changes

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

  const groupedInvestments = investments.reduce((acc, investment) => {
    const category = investment.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(investment);
    return acc;
  }, {});

  // Highlight if no scheduled investments
  const showNoInvestmentsHighlight = !isSample && investments.length === 0;

  // Export handler
  const handleExport = () => {
    exportInvestmentsToExcel(investments);
  };
  const handleExportPDF = () => {
    exportInvestmentsToPDF(investments);
  };

  return (
    <div className="investment-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{isSample ? 'Sample Investments' : 'Scheduled Investments'}</h3>
        {!isSample && investments.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn export-btn" onClick={handleExport}>Export to Excel</button>
            <button className="btn export-btn" onClick={handleExportPDF}>Export to PDF</button>
          </div>
        )}
      </div>
      {showNoInvestmentsHighlight && (
        <div className="no-investments-highlight">
          <p>No scheduled investments found. <strong>Add your first investment in the <Link to='/investments'>Investments</Link> tab!</strong></p>
        </div>
      )}
      {Object.entries(groupedInvestments).map(([category, investments]) => {
        const categoryInvestment = investments.reduce((acc, investment) => acc + investment.principal, 0);
        const categoryInterest = investments.reduce((acc, investment) => acc + investment.interest, 0);

        return (
          <div key={category} className="category-section">
            <h4>{category}</h4>
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
                    {!isSample && <button onClick={() => handleDelete(investment.id)} className="delete-button">Delete</button>}
                  </li>
                );
              })}
            </ul>
            <div className="investment-summary">
              <h5>{category} Summary</h5>
              <p>Total Investment: ₹{categoryInvestment.toFixed(2)}</p>
              <p>Total Interest Earned: ₹{categoryInterest.toFixed(2)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvestmentList;
