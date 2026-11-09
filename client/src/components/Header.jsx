import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Comgenz Private Support</h1>
        {user && (
          <div className="user-info">
            <span className="user-name">{user.email}</span>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;