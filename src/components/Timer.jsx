// ============================================
// Timer Component
// Circular SVG countdown timer for focus sessions
// ============================================

import './Timer.css';

/**
 * Timer - circular progress ring showing remaining time
 * @param {number} timeLeft - Remaining seconds
 * @param {number} totalTime - Total session seconds
 * @param {boolean} isRunning - Whether timer is active
 * @param {string} phase - 'focus' | 'break'
 */
const Timer = ({ timeLeft, totalTime, isRunning, phase = 'focus' }) => {
  // SVG circle math
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Color based on phase and urgency
  const getColor = () => {
    if (phase === 'break') return '#43D9AD';
    if (progress < 0.2) return '#FF6584'; // Last 20% — urgent
    return '#6C63FF';
  };

  const color = getColor();

  return (
    <div className={`timer-container ${isRunning ? 'timer--running' : ''}`}>
      {/* SVG Ring */}
      <svg
        className="timer-svg"
        width="260"
        height="260"
        viewBox="0 0 260 260"
      >
        {/* Background track */}
        <circle
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="10"
        />

        {/* Progress arc */}
        <circle
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 130 130)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />

        {/* Glow dot at progress end */}
        {isRunning && (
          <circle
            cx={130 + radius * Math.cos((2 * Math.PI * progress) - Math.PI / 2)}
            cy={130 + radius * Math.sin((2 * Math.PI * progress) - Math.PI / 2)}
            r="6"
            fill={color}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>

      {/* Center Content */}
      <div className="timer-center">
        {/* Phase label */}
        <span className="timer-phase" style={{ color }}>
          {phase === 'focus' ? '🎯 Focus' : '☕ Break'}
        </span>

        {/* Time display */}
        <div className={`timer-time ${isRunning ? 'timer-time--pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>

        {/* Status */}
        <span className="timer-status">
          {isRunning ? 'In progress...' : timeLeft === totalTime ? 'Ready to start' : 'Paused'}
        </span>
      </div>
    </div>
  );
};

export default Timer;
