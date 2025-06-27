
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import Header from './components/common/Header';
import { listenToAuthChanges } from './actions/authActions';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


import Footer from './components/common/Footer';
import emailjs from 'emailjs-com';




function App() {
  // Custom PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Contact modal state and handler
  const [showContact, setShowContact] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // EmailJS integration
    try {
      await emailjs.send(
        'service_b27efxz', // replace with your EmailJS service ID
        'template_9jvpx3r', // replace with your EmailJS template ID
        {
          from_email: contactEmail,
          message: contactMessage,
        },
        '5rf3vBM2WsmQhgS4G' // replace with your EmailJS public key
      );
      setContactSent(true);
      setTimeout(() => {
        setShowContact(false);
        setContactSent(false);
        setContactEmail('');
        setContactMessage('');
      }, 2000);
    } catch (err) {
      alert('Failed to send message. Please try again later.');
    }
  };

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
      {/* Only show footer if not on landing page */}
      {location.pathname !== '/' && <Footer onContactClick={() => setShowContact(true)} />}
      {showContact && (
        <div className="contact-modal-overlay" onClick={() => setShowContact(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <h3>Contact Support</h3>
            <p style={{ marginBottom: 12 }}>
              For support, email us at <a href="mailto:manabudget25@gmail.com" style={{ color: '#28a745', textDecoration: 'underline' }}>manabudget25@gmail.com</a>
              <br />or use the form below:
            </p>
            <form onSubmit={handleContactSubmit}>
              <label htmlFor="contact-email">Your Email</label>
              <input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required rows={4} style={{ width: '100%', marginBottom: 8 }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn secondary" onClick={() => setShowContact(false)}>Cancel</button>
                <button type="submit" className="btn primary">Send</button>
              </div>
            </form>
            {contactSent && <div style={{ color: '#28a745', marginTop: 8 }}>Thank you! Your message has been sent.</div>}
          </div>
        </div>
      )}
    </>

  );
}

export default App;
