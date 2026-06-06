// ============================================
// sessionService.js
// Focus session API calls
// ============================================

import api from './api';

/**
 * Get all focus sessions for the current user
 */
export const getSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

/**
 * Create a new focus session record
 * @param {{ duration_minutes, started_at, ended_at, status }} sessionData
 */
export const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

/**
 * Update a focus session
 * @param {string} id - Session UUID
 * @param {object} updates
 */
export const updateSession = async (id, updates) => {
  const response = await api.put(`/sessions/${id}`, updates);
  return response.data;
};

/**
 * Delete a focus session
 * @param {string} id - Session UUID
 */
export const deleteSession = async (id) => {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
};
