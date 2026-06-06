// ============================================
// FocusSessionPage
// Pomodoro-style focus timer — saves sessions to API
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import useSessions from '../hooks/useSessions';
import { motivationalMessages } from '../data/mockData';
import './FocusSessionPage.css';

// Session presets in minutes
const PRESETS = [
  { label: '15 min', focus: 15, break: 5  },
  { label: '25 min', focus: 25, break: 5  },
  { label: '45 min', focus: 45, break: 10 },
  { label: '60 min', focus: 60, break: 15 },
];

const FocusSessionPage = () => {
  const navigate = useNavigate();
  const { saveSession, totalSessions } = useSessions();

  // Timer state
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [phase, setPhase]                   = useState('focus');
  const [timeLeft, setTimeLeft]             = useState(PRESETS[1].focus * 60);
  const [isRunning, setIsRunning]           = useState(false);
  const [sessionCount, setSessionCount]     = useState(0);
  const [message, setMessage]               = useState(motivationalMessages[0]);
  const [messageIdx, setMessageIdx]         = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [saving, setSaving]                 = useState(false);

  const intervalRef = useRef(null);
  const totalTime = phase === 'focus'
    ? PRESETS[selectedPreset].focus * 60
    : PRESETS[selectedPreset].break * 60;

  // Rotate motivational message every 30 seconds
  useEffect(() => {
    if (!isRunning) return;
    const msgInterval = setInterval(() => {
      setMessageIdx(prev => {
        const next = (prev + 1) % motivationalMessages.length;
        setMessage(motivationalMessages[next]);
        return next;
      });
    }, 30000);
    return () => clearInterval(msgInterval);
  }, [isRunning]);

  // Countdown logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Handle phase switch when timer hits 0
  const handlePhaseComplete = useCallback(() => {
    setIsRunning(false);
    if (phase === 'focus') {
      // Auto-save the completed focus session
      const endTime = new Date();
      if (sessionStartTime) {
        saveSession({
          duration_minutes: PRESETS[selectedPreset].focus,
          started_at:       sessionStartTime.toISOString(),
          ended_at:         endTime.toISOString(),
          status:           'completed',
        });
      }
      setSessionCount(prev => prev + 1);
      setPhase('break');
      setTimeLeft(PRESETS[selectedPreset].break * 60);
    } else {
      setPhase('focus');
      setTimeLeft(PRESETS[selectedPreset].focus * 60);
    }
  }, [phase, selectedPreset, sessionStartTime, saveSession]);

  // Controls
  const handleStart = () => {
    if (!sessionStartTime || phase === 'focus') {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
  };

  const handlePause  = () => setIsRunning(false);
  const handleReset  = () => {
    setIsRunning(false);
    setPhase('focus');
    setTimeLeft(PRESETS[selectedPreset].focus * 60);
    setSessionStartTime(null);
  };

  // Change preset
  const handlePresetChange = (idx) => {
    if (isRunning) return;
    setSelectedPreset(idx);
    setPhase('focus');
    setTimeLeft(PRESETS[idx].focus * 60);
    setSessionStartTime(null);
  };

  // Complete session manually and navigate to success
  const handleComplete = async () => {
    setIsRunning(false);
    setSaving(true);

    // Save current session if it was running
    if (sessionStartTime && sessionCount === 0) {
      const elapsed = Math.round(
        (PRESETS[selectedPreset].focus * 60 - timeLeft) / 60
      );
      if (elapsed > 0) {
        await saveSession({
          duration_minutes: elapsed,
          started_at:       sessionStartTime.toISOString(),
          ended_at:         new Date().toISOString(),
          status:           'completed',
        });
      }
    }

    setSaving(false);
    navigate('/success', {
      state: {
        sessionCount:    sessionCount,
        durationMinutes: PRESETS[selectedPreset].focus,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="focus-page">

          {/* ── Page Header ── */}
          <div className="focus-header">
            <div>
              <h1 className="focus-title">Focus Session</h1>
              <p className="focus-subtitle">
                Eliminate distractions and enter deep work mode
              </p>
            </div>
            <div className="session-count">
              <span className="session-count__number">{sessionCount}</span>
              <span className="session-count__label">sessions today</span>
            </div>
          </div>

          {/* ── Main Focus Area ── */}
          <div className="focus-main">

            {/* Timer Card */}
            <div className={`focus-card ${isRunning ? 'focus-card--active' : ''}`}>

              {/* Preset Selector */}
              <div className="preset-selector">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    className={`preset-btn ${selectedPreset === idx ? 'preset-btn--active' : ''}`}
                    onClick={() => handlePresetChange(idx)}
                    disabled={isRunning}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="timer-wrapper">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={totalTime}
                  isRunning={isRunning}
                  phase={phase}
                />
              </div>

              {/* Controls */}
              <div className="timer-controls">
                {!isRunning ? (
                  <button className="control-btn control-btn--start" onClick={handleStart}>
                    ▶ {timeLeft === totalTime ? 'Start Session' : 'Resume'}
                  </button>
                ) : (
                  <button className="control-btn control-btn--pause" onClick={handlePause}>
                    ⏸ Pause
                  </button>
                )}
                <button
                  className="control-btn control-btn--reset"
                  onClick={handleReset}
                  disabled={isRunning && timeLeft === totalTime}
                >
                  ↺ Reset
                </button>
              </div>

              {/* Motivational Message */}
              <div className={`motivation-box ${isRunning ? 'motivation-box--visible' : ''}`}>
                <p className="motivation-text">{message}</p>
              </div>
            </div>

            {/* Side Panel */}
            <div className="focus-sidebar">

              {/* Session Info */}
              <div className="sidebar-card">
                <h3 className="sidebar-title">📋 Session Info</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Mode</span>
                    <span className="info-value info-value--primary">
                      {phase === 'focus' ? '🎯 Focus' : '☕ Break'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration</span>
                    <span className="info-value">{PRESETS[selectedPreset].focus} min</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Break</span>
                    <span className="info-value">{PRESETS[selectedPreset].break} min</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Today</span>
                    <span className="info-value">{sessionCount} done</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">All Time</span>
                    <span className="info-value">{totalSessions} sessions</span>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="sidebar-card tips-card">
                <h3 className="sidebar-title">💡 Focus Tips</h3>
                <ul className="tips-list">
                  {[
                    'Put your phone face-down',
                    'Close unnecessary browser tabs',
                    'Use headphones with ambient sound',
                    'Keep water nearby',
                    'Take notes as you study',
                  ].map((tip, i) => (
                    <li key={i} className="tip-item">
                      <span className="tip-dot" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complete Button */}
              {sessionCount > 0 && (
                <button
                  className="btn btn-primary complete-btn"
                  onClick={handleComplete}
                  disabled={saving}
                >
                  {saving ? '💾 Saving...' : '🏆 Complete Session'}
                </button>
              )}
            </div>
          </div>

          {/* ── Pomodoro Progress ── */}
          <div className="pomodoro-progress">
            <p className="pomodoro-label">Pomodoro Progress</p>
            <div className="pomodoro-dots">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`pomodoro-dot ${i < sessionCount ? 'pomodoro-dot--done' : ''} ${i === sessionCount && phase === 'focus' && isRunning ? 'pomodoro-dot--active' : ''}`}
                />
              ))}
            </div>
            <p className="pomodoro-hint">
              {sessionCount < 4
                ? `${4 - sessionCount} sessions until long break`
                : '🎉 Long break earned! Great work!'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FocusSessionPage;
