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

  return (
    <div>
      <h2>Dashboard</h2>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <InvestmentList />
        </>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
};

export default DashboardPage;
