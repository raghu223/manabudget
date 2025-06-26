
import React, { useEffect, useState } from 'react';
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
  // Custom PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowInstall(false));
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  // Hide Header on landing page ("/"), login, and when not authenticated
  const hideHeaderRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const showHeader = isAuthenticated && !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      {showInstall && (
        <div style={{ position: 'fixed', bottom: 20, left: 0, right: 0, zIndex: 9999, display: 'flex', justifyContent: 'center' }}>
          <button className="btn" style={{ maxWidth: 320 }} onClick={handleInstallClick}>
            Install ManaBudget App
          </button>
        </div>
      )}
      <ToastContainer position="top-center" />
      <div className="container">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
