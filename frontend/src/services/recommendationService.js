// ============================================
// recommendationService.js
// AI Recommendations API calls
// ============================================

import api from './api';

/**
 * Get stored recommendations for the current user
 */
export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

/**
 * Trigger AI to generate new recommendations
 * based on current user data
 */
export const generateRecommendations = async () => {
  const response = await api.post('/recommendations/generate');
  return response.data;
};
