import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <ul className="nav-links">
        <li>
          <NavLink to="/" exact activeClassName="active">Dashboard</NavLink>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/budget" activeClassName="active">Budget</NavLink>
            </li>
            <li>
              <NavLink to="/interest" activeClassName="active">Interest</NavLink>
            </li>
            <li>
              <NavLink to="/profile" activeClassName="active">Profile</NavLink>
            </li>
          </>
        )}
      </ul>
      <div className="user-actions">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <ul>
            <li>
              <NavLink to="/login" activeClassName="active">Login</NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;
