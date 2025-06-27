import React from 'react';

const PrivacyPolicy = () => (
  <div className="container" style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 8, padding: 24 }}>
    <h2>Privacy Policy</h2>
    <p><strong>ManaBudget</strong> respects your privacy. We do not sell or share your personal information with third parties. Your data is stored securely and used only to provide you with the best budgeting and investment experience.</p>
    <ul>
      <li>We collect your name and email for authentication and personalization.</li>
      <li>Your investment and budget data is stored securely in the cloud and is only accessible to you.</li>
      <li>We use Google authentication for secure sign-in.</li>
      <li>You can request deletion of your account and data at any time.</li>
    </ul>
    <p>If you have any questions about your privacy, please use the Contact Support form.</p>
  </div>
);

export default PrivacyPolicy;
