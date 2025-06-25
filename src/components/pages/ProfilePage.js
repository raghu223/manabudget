import React from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
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
