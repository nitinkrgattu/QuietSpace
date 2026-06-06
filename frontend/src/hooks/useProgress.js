// ============================================
// useProgress.js
// Custom hook for progress and analytics data
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { getProgress, getAnalytics } from '../services/progressService';

const useProgress = () => {
  const [progress, setProgress]   = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [progressData, analyticsData] = await Promise.all([
        getProgress(),
        getAnalytics(),
      ]);
      setProgress(progressData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      console.error('useProgress fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    progress,
    analytics,
    loading,
    error,
    refetch: fetchAll,
  };
};

export default useProgress;
