// ============================================
// taskService.js
// Task CRUD API calls
// ============================================

import api from './api';

/**
 * Get all tasks for the current user
 */
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

/**
 * Create a new task
 * @param {{ text, subject, priority }} taskData
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

/**
 * Update a task
 * @param {string} id - Task UUID
 * @param {object} updates - Fields to update
 */
export const updateTask = async (id, updates) => {
  const response = await api.put(`/tasks/${id}`, updates);
  return response.data;
};

/**
 * Delete a task
 * @param {string} id - Task UUID
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

/**
 * Toggle task completion status
 * @param {string} id - Task UUID
 */
export const toggleTaskComplete = async (id) => {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data;
};
