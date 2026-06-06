// ============================================
// useTasks.js
// Custom hook for task CRUD operations
// Manages loading, error, and optimistic updates
// ============================================

import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../services/taskService';

const useTasks = () => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Fetch all tasks ──
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      console.error('useTasks fetchTasks error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Add task ──
  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to create task');
      return { success: false, error: err.message };
    }
  }, []);

  // ── Toggle completion ──
  const toggleTask = useCallback(async (id) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    try {
      const updated = await toggleTaskComplete(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      // Revert on failure
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
      setError(err.message || 'Failed to update task');
    }
  }, []);

  // ── Delete task ──
  const removeTask = useCallback(async (id) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      // Revert on failure
      fetchTasks();
      setError(err.message || 'Failed to delete task');
    }
  }, [fetchTasks]);

  // ── Edit task ──
  const editTask = useCallback(async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update task');
      return { success: false, error: err.message };
    }
  }, []);

  // ── Clear completed ──
  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    setTasks(prev => prev.filter(t => !t.completed));
    try {
      await Promise.all(completedIds.map(id => deleteTask(id)));
    } catch (err) {
      fetchTasks();
      setError(err.message || 'Failed to clear completed tasks');
    }
  }, [tasks, fetchTasks]);

  // ── Computed stats ──
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount     = tasks.length;
  const completionPct  = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    removeTask,
    editTask,
    clearCompleted,
    refetch: fetchTasks,
    completedCount,
    totalCount,
    completionPct,
  };
};

export default useTasks;
