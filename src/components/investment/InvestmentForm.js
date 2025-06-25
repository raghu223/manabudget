import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { addInvestment } from '../../actions/investmentActions';
import './InvestmentForm.css';

const InvestmentForm = () => {
  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.id);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInvestment = {
      userId,
      name, // Add name to the new investment
      principal: parseFloat(principal),
      rate: parseFloat(rate),
      startDate: date,
      interest: 0,
    };

    dispatch(addInvestment(newInvestment));

    toast.success('Investment added successfully!');

    setName(''); // Clear the name field
    setPrincipal('');
    setRate('');
    setDate(new Date());
  };

  return (
    <div className="investment-form-container">
      <h3>Add New Investment</h3>
      <form onSubmit={handleSubmit} className="investment-form">
        <div className="form-group">
          <label>Investment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Principal Amount</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Investment Start Date</label>
          <Calendar
            onChange={setDate}
            value={date}
          />
        </div>
        <button type="submit">Add Investment</button>
      </form>
    </div>
  );
};

export default InvestmentForm;
