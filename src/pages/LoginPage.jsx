// ============================================
// LoginPage
// Entry point — email/password login with validation
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Simple client-side validation
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Simulate login loading then redirect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  // Quick demo login
  const handleDemoLogin = () => {
    setFormData({ email: 'alex@student.edu', password: 'demo123' });
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="login-page">
      {/* Background decorations */}
      <div className="login-bg">
        <div className="login-bg__blob login-bg__blob--1" />
        <div className="login-bg__blob login-bg__blob--2" />
        <div className="login-bg__blob login-bg__blob--3" />
      </div>

      <div className="login-container">
        {/* Left Panel — Branding */}
        <div className="login-brand">
          <div className="brand-logo">
            <span className="brand-logo__icon">🧘</span>
          </div>
          <h1 className="brand-title">QuietSpace</h1>
          <p className="brand-tagline">
            Your AI-powered focus companion for deeper study and better results.
          </p>

          {/* Feature highlights */}
          <ul className="brand-features">
            {[
              { icon: '⏱️', text: 'Pomodoro focus sessions' },
              { icon: '🤖', text: 'AI-powered study tips' },
              { icon: '📊', text: 'Progress tracking' },
              { icon: '✅', text: 'Smart task management' },
            ].map((f, i) => (
              <li key={i} className="brand-feature">
                <span className="brand-feature__icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-card">
          <div className="login-card__header">
            <h2 className="login-title">Welcome back 👋</h2>
            <p className="login-subtitle">Sign in to continue your focus journey</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  placeholder="you@student.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="form-forgot">
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>

            {/* Divider */}
            <div className="form-divider">
              <span>or</span>
            </div>

            {/* Demo Login */}
            <button
              type="button"
              className="demo-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              🚀 Try Demo Account
            </button>
          </form>

          <p className="login-footer">
            New to QuietSpace?{' '}
            <button type="button" className="signup-link">
              Create free account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
