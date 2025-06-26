import React, { useState, useEffect } from 'react';
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
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.id);

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!principal || isNaN(principal) || Number(principal) <= 0) newErrors.principal = 'Principal must be a positive number.';
    if (!rate || isNaN(rate) || Number(rate) <= 0) newErrors.rate = 'Rate must be a positive number.';
    if (!date) newErrors.date = 'Start date is required.';
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line
  }, [name, principal, rate, date, category]);

  const isFormValid = () => {
    const errs = validate();
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, principal: true, rate: true, date: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    let finalRate = parseFloat(rate);
    if (category === 'Bond') {
      finalRate *= 12; // Convert monthly rate to annual for backend consistency
    }

    const newInvestment = {
      userId,
      name,
      category,
      principal: parseFloat(principal),
      rate: finalRate,
      startDate: date,
      interest: 0,
    };

    dispatch(addInvestment(newInvestment));
    toast.success('Investment added successfully!');
    setName('');
    setPrincipal('');
    setRate('');
    setDate(new Date());
    setCategory('General');
    setErrors({});
    setTouched({});
  };

  return (
    <div className="investment-form-container">
      <h3>Add New Investment</h3>
      <form onSubmit={handleSubmit} className="investment-form" noValidate>
        <div className="form-group">
          <label>Investment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            required
          />
          {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="General">General</option>
            <option value="Gold Loan">Gold Loan</option>
            <option value="Bond">Bond</option>
          </select>
        </div>
        <div className="form-group">
          <label>Principal Amount</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            onBlur={() => handleBlur('principal')}
            required
          />
          {touched.principal && errors.principal && <span className="form-error">{errors.principal}</span>}
        </div>
        <div className="form-group">
          <label>{category === 'Bond' ? 'Monthly Interest Rate (%)' : 'Annual Interest Rate (%)'}</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            onBlur={() => handleBlur('rate')}
            required
          />
          {touched.rate && errors.rate && <span className="form-error">{errors.rate}</span>}
        </div>
        <div className="form-group">
          <label>Investment Start Date</label>
          <Calendar
            onChange={(d) => setDate(d)}
            value={date}
            onBlur={() => handleBlur('date')}
          />
          {touched.date && errors.date && <span className="form-error">{errors.date}</span>}
        </div>
        <button type="submit" disabled={!isFormValid()}>Add Investment</button>
      </form>
    </div>
  );
};

export default InvestmentForm;
