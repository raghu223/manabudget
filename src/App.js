import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import Header from './components/common/Header';
import { listenToAuthChanges } from './actions/authActions';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './components/common/Spinner.css';

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  // Hide Header on landing page ("/"), login, and when not authenticated
  const hideHeaderRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const showHeader = isAuthenticated && !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <ToastContainer position="top-center" />
      <div className="container">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
