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
            <button className="btn export-btn" onClick={handleExport} aria-label="Export to Excel" title="Export to Excel">
              {/* Excel Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#217346"/>
                <path d="M7.5 8.5L10 12L7.5 15.5M16.5 8.5L14 12L16.5 15.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn export-btn" onClick={handleExportPDF} aria-label="Export to PDF" title="Export to PDF">
              {/* PDF Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#D32F2F"/>
                <path d="M8 8H16V16H8V8Z" stroke="#fff" strokeWidth="1.5"/>
                <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Arial" dy=".3em">PDF</text>
              </svg>
            </button>
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
