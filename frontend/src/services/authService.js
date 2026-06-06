// ============================================
// authService.js
// Local app authentication backed by Supabase database tables
// ============================================

import api from './api';

const TOKEN_KEY = 'quietspace_token';
const USER_KEY = 'quietspace_user';

const saveAuth = (data) => {
  if (data?.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Register a new user account in Supabase database.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 */
export const register = async (email, password, name) => {
  const response = await api.post('/auth/register', { email, password, name });
  saveAuth(response.data);
  return response.data;
};

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  saveAuth(response.data);
  return response.data;
};

/**
 * Logout current user.
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearStoredAuth();
  }
};

/**
 * Get current locally stored session.
 */
export const getSession = async () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return token && user ? { access_token: token, user } : null;
};

/**
 * Get current user profile from the backend when possible.
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/profile');
  const user = response.data;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};
