// ============================================
// progressService.js
// Progress and analytics API calls
// ============================================

import api from './api';

/**
 * Get progress stats for the current user
 */
export const getProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

/**
 * Get computed analytics (weekly chart, streaks, etc.)
 */
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};
