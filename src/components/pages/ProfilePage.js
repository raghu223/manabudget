import React from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const toCamelCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user && (
        <div>
          <p>
            <strong>Name:</strong> <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{toCamelCase(user.name)}</span>
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
