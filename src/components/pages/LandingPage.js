import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './LandingPage.css';
// Footer import removed for landing page cleanup

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.19C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.13a14.5 14.5 0 0 1 0-8.26l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.56l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.19C6.71 42.52 14.82 48 24 48z"/></g></svg>
);

const LandingPage = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Add user to Firestore if not present
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        userData = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
        };
        await setDoc(userDocRef, userData);
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: { id: user.uid, ...userData } });
      dispatch({ type: 'FETCH_DATA', payload: user.uid });
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed.');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to ManaBudget</h1>
        <p className="tagline">Your all-in-one solution for budgeting, investments, and financial growth.</p>
        {/* Video section removed for a cleaner landing page */}
        <ul className="features-list">
          <li>✔️ Track investments, loans, and savings in one place</li>
          <li>✔️ Smart dashboards and category summaries</li>
          <li>✔️ Advanced gold loan and bond logic</li>
          <li>✔️ Quick interest calculator</li>
          <li>✔️ Secure cloud sync and session persistence</li>
        </ul>
        <div className="cta-buttons">
          <Link to="/signup" className="btn primary">Get Started Free</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
        <div className="social-login">
          <p>Or sign up with:</p>
          <button className="btn google" onClick={handleGoogleLogin}><GoogleIcon />Sign in with Google</button>
      {/* <button className="btn facebook">Facebook</button> */}
      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
</div>
// Footer removed from landing page for a cleaner first impression
  );
};

export default LandingPage;
