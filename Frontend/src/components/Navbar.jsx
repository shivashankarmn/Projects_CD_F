// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, name, logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Smart Waste Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {role === "USER" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/user">
                      User Dashboard
                    </Link>
                  </li>
                )}
                {role === "ADMIN" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {role === "DRIVER" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/driver">
                      Driver Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isLoggedIn && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {name}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;