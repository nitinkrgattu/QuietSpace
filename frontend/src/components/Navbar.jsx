// ============================================
// Navbar Component
// Responsive navigation bar with active states
// Uses real auth context for user info and logout
// ============================================

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { userDisplayName, userInitials, logout } = useAuth();

  // Navigation links configuration
  const navLinks = [
    { path: '/dashboard',          label: 'Dashboard', icon: '🏠' },
    { path: '/focus',              label: 'Focus',     icon: '⏱️' },
    { path: '/tasks',              label: 'Tasks',     icon: '✅' },
    { path: '/progress',           label: 'Progress',  icon: '📊' },
    { path: '/ai-recommendations', label: 'AI Tips',   icon: '🤖' },
  ];

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🧘</span>
          <span className="logo-text">QuietSpace</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'navbar-link--active' : ''}`
                }
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Avatar & Logout */}
        <div className="navbar-user">
          <div className="user-avatar" title={userDisplayName}>
            {userInitials}
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <span>↩</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `mobile-link ${isActive ? 'mobile-link--active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button className="mobile-logout" onClick={handleLogout}>
                ↩ Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
