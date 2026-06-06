// ============================================
// useSessions.js
// Custom hook for focus session management
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { getSessions, createSession, deleteSession } from '../services/sessionService';

const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Fetch sessions ──
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
      console.error('useSessions fetchSessions error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ── Save completed session ──
  const saveSession = useCallback(async (sessionData) => {
    try {
      const newSession = await createSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return { success: true, session: newSession };
    } catch (err) {
      setError(err.message || 'Failed to save session');
      return { success: false, error: err.message };
    }
  }, []);

  // ── Delete session ──
  const removeSession = useCallback(async (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    try {
      await deleteSession(id);
    } catch (err) {
      fetchSessions();
      setError(err.message || 'Failed to delete session');
    }
  }, [fetchSessions]);

  // ── Computed stats ──
  const totalSessions = sessions.length;
  const totalMinutes  = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalHours    = Math.round((totalMinutes / 60) * 10) / 10;

  return {
    sessions,
    loading,
    error,
    saveSession,
    removeSession,
    refetch: fetchSessions,
    totalSessions,
    totalMinutes,
    totalHours,
  };
};

export default useSessions;
