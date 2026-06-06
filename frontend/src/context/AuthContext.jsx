// ============================================
// AuthContext.jsx
// Global authentication state management
// ============================================

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getStoredToken,
  getStoredUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    setUser(storedUser);
    setSession(token && storedUser ? { access_token: token, user: storedUser } : null);
    setLoading(false);
  }, []);

  const mapAuthError = (error) => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') return detail;

    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('invalid credentials') || msg.includes('incorrect')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('already exists') || msg.includes('duplicate')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('password') && msg.includes('weak')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    return error?.message || 'Something went wrong. Please try again.';
  };

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const data = await loginService(email, password);
      setUser(data.user);
      setSession({ access_token: data.access_token, user: data.user });
      return { success: true, data };
    } catch (error) {
      const message = mapAuthError(error);
      setAuthError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setAuthError(null);
    try {
      const data = await registerService(email, password, name);
      setUser(data.user);
      setSession({ access_token: data.access_token, user: data.user });
      return { success: true, data };
    } catch (error) {
      const message = mapAuthError(error);
      setAuthError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSession(null);
    }
  }, []);

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'Student';

  const userInitials = userDisplayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const value = {
    user,
    session,
    loading,
    authError,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    userDisplayName,
    userInitials,
    userEmail: user?.email || '',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
