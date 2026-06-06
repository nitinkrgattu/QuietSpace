// ============================================
// LoginPage
// Entry point — email/password login + register
// Connected to Supabase Auth via AuthContext
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, register, isAuthenticated, authError, loading: authLoading } = useAuth();

  // ── Diagnostic: render counter ──
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // useRef guard: prevents duplicate submissions even across re-renders
  const isSubmittingRef = useRef(false);

  // ── Diagnostic: submit counter ──
  const submitCountRef = useRef(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Mode: 'login' | 'register'
  const [mode, setMode]         = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [rateLimitedUntil, setRateLimitedUntil] = useState(null);

  console.log(`[QuietSpace LoginPage] Render #${renderCountRef.current}`, {
    isAuthenticated,
    authLoading,
    mode,
  });

  // Reset submission guard when mode changes
  const switchMode = (newMode) => {
    isSubmittingRef.current = false;
    setMode(newMode);
    setErrors({});
    setSuccessMsg('');
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
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
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    submitCountRef.current += 1;
    console.log(
      `[QuietSpace LoginPage] handleSubmit() fired — submit #${submitCountRef.current}`,
      { mode, isSubmittingRef: isSubmittingRef.current, loading, ts: new Date().toISOString() }
    );

    // Guard: block if already in-flight (ref persists across re-renders)
    if (isSubmittingRef.current || loading) {
      console.warn('[QuietSpace LoginPage] handleSubmit() BLOCKED — already in-flight');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Lock submission
    isSubmittingRef.current = true;
    setLoading(true);
    setSuccessMsg('');

    console.log(`[QuietSpace LoginPage] Calling ${mode === 'login' ? 'login' : 'register'}() at ${new Date().toISOString()}`);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        console.log('[QuietSpace LoginPage] login() result:', result.success ? 'SUCCESS' : 'FAILED');
        if (result.success) {
          navigate('/dashboard');
        }
      } else {
        const result = await register(formData.email, formData.password, formData.name);
        console.log('[QuietSpace LoginPage] register() result:', result.success ? 'SUCCESS' : 'FAILED');
        if (result.success) {
          setSuccessMsg('Account created! Signing you in now.');
          setMode('login');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        }
      }
    } finally {
      // Always unlock — even if an error occurred
      setLoading(false);
      isSubmittingRef.current = false;
      console.log('[QuietSpace LoginPage] handleSubmit() complete — lock released');
    }
  };

  // Quick demo login
  const handleDemoLogin = async () => {
    if (isSubmittingRef.current || loading) return;
    isSubmittingRef.current = true;
    setLoading(true);
    setSuccessMsg('');
    try {
      const result = await login('demo@quietspace.app', 'demo123456');
      if (!result.success) {
        setErrors({ email: 'Demo account not configured. Please create your own account.' });
      }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Friendly display for rate-limit errors
  const displayError = authError
    ? authError.toLowerCase().includes('rate limit') || authError.toLowerCase().includes('too many')
      ? '⏳ ' + authError + ' This is a Supabase email limit — try a different email or wait 1 hour.'
      : authError
    : null;

   // When a 429 occurs, set a short cooldown to prevent immediate retries
   useEffect(() => {
     if (authError && (authError.toLowerCase().includes('rate') || authError.toLowerCase().includes('too many')) && mode === 'register') {
       const until = Date.now() + 60 * 1000; // 60 seconds
       setRateLimitedUntil(until);
       const timer = setTimeout(() => setRateLimitedUntil(null), 60 * 1000);
       return () => clearTimeout(timer);
     }
     return undefined;
   }, [authError, mode]);

   const isRateLimited = rateLimitedUntil && Date.now() < rateLimitedUntil;
   const isLoading = loading || authLoading;
   const isRegisterDisabled = mode === 'register' && isRateLimited;

   return (
    <div className="login-page">
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

        {/* Right Panel — Auth Form */}
        <div className="login-card">
          <div className="login-card__header">
            <h2 className="login-title">
              {mode === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
            </h2>
            <p className="login-subtitle">
              {mode === 'login'
                ? 'Sign in to continue your focus journey'
                : 'Join QuietSpace and start focusing today'}
            </p>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="form-success" role="alert">
              {successMsg}
            </div>
          )}

          {/* Auth error from context */}
          {displayError && !successMsg && (
            <div className="form-alert" role="alert">
              ⚠️ {displayError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Name field (register only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
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
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPass ? 'text' : 'password'}
                    className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? 'login-btn--loading' : ''}`}
              disabled={isLoading || isRegisterDisabled}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <><span className="spinner" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                mode === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </button>

            {/* Submit cooldown hint for register mode */}
            {isRegisterDisabled && (
              <p className="form-help form-help--warn">
                Please wait a minute before trying again, or use a different email.
              </p>
            )}

            {/* Demo Login (login mode only) */}
            {mode === 'login' && (
              <>
                <div className="form-divider"><span>or</span></div>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  🚀 Try Demo Account
                </button>
              </>
            )}
          </form>

          <p className="login-footer">
            {mode === 'login' ? (
              <>
                New to QuietSpace?{' '}
                <button
                  type="button"
                  className="signup-link"
                  onClick={() => switchMode('register')}
                >
                  Create free account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="signup-link"
                  onClick={() => switchMode('login')}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
