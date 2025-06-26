import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataAndUpdate } from '../../actions/dataActions';
import InvestmentList from '../investment/InvestmentList';

const DashboardPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      dispatch(fetchDataAndUpdate(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

  const toCamelCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {isAuthenticated ? (
        <>
          <p style={{ fontSize: '1.15rem' }}>Welcome, <strong style={{ fontWeight: 700, fontSize: '1.25rem' }}>{toCamelCase(user.name)}</strong>!</p>
          <InvestmentList />
        </>
      ) : (
        <>
          <p>Welcome to ManaBudget! Here's a sample view of our features.</p>
          <InvestmentList investments={sampleInvestments} />
        </>
      )}
    </div>
  );
};

const sampleInvestments = [
  {
    id: 'sample1',
    name: 'Sample Gold Loan',
    category: 'Gold Loan',
    principal: 50000,
    rate: 12,
    startDate: new Date('2024-01-15').toISOString(),
    interest: 2500,
  },
  {
    id: 'sample2',
    name: 'Sample Bond',
    category: 'Bond',
    principal: 100000,
    rate: 8,
    startDate: new Date('2023-11-01').toISOString(),
    interest: 10000,
  },
  {
    id: 'sample3',
    name: 'Sample General Investment',
    category: 'General',
    principal: 25000,
    rate: 5,
    startDate: new Date('2024-03-01').toISOString(),
    interest: 500,
  },
];

export default DashboardPage;
