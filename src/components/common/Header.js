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

  const toCamelCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <nav>
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" exact activeClassName="active">Dashboard</NavLink>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/budget" activeClassName="active">Budget</NavLink>
            </li>
            <li>
              <NavLink to="/investments" activeClassName="active">Investments</NavLink>
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
            <span style={{ fontWeight: 700, fontSize: '1.08rem' }}>Welcome, {toCamelCase(user.name)}</span>
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
