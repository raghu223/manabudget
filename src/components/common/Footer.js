
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ onContactClick }) => (
  <footer className="footer">
    <div className="footer-links">
      <Link to="/privacy-policy">Privacy Policy</Link>
      <span>|</span>
      <Link to="/terms-of-service">Terms of Service</Link>
      <span>|</span>
      <button className="footer-contact" onClick={onContactClick}>Contact Support</button>
    </div>
    <div className="footer-copy">&copy; {new Date().getFullYear()} ManaBudget</div>
  </footer>
);

export default Footer;
