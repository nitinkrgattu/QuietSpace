// ============================================
// SuccessPage
// Session completion celebration screen
// Uses real session data passed via router state
// ============================================

import { useNavigate, useLocation } from 'react-router-dom';
import useSessions from '../hooks/useSessions';
import './SuccessPage.css';

const SuccessPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { totalSessions } = useSessions();

  // Get session data passed from FocusSessionPage
  const sessionCount    = location.state?.sessionCount    || 1;
  const durationMinutes = location.state?.durationMinutes || 25;

  const particles = ['🎉', '⭐', '🏆', '✨', '🎯', '💪', '🌟', '🔥'];

  return (
    <div className="success-page">
      {/* Animated background particles */}
      <div className="success-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 11}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="success-container">

        {/* ── Trophy Icon ── */}
        <div className="success-trophy">
          <div className="trophy-ring trophy-ring--outer" />
          <div className="trophy-ring trophy-ring--inner" />
          <span className="trophy-icon">🏆</span>
        </div>

        {/* ── Main Message ── */}
        <div className="success-message">
          <h1 className="success-title">Session Complete!</h1>
          <p className="success-subtitle">
            Outstanding work! You've successfully completed your focus session.
            Every session brings you closer to your goals.
          </p>
        </div>

        {/* ── Session Stats ── */}
        <div className="success-stats">
          <div className="success-stat">
            <span className="success-stat__icon">⏱️</span>
            <span className="success-stat__value">{durationMinutes} min</span>
            <span className="success-stat__label">Focused</span>
          </div>
          <div className="success-stat success-stat--divider" />
          <div className="success-stat">
            <span className="success-stat__icon">🎯</span>
            <span className="success-stat__value">{sessionCount}</span>
            <span className="success-stat__label">Sessions Today</span>
          </div>
          <div className="success-stat success-stat--divider" />
          <div className="success-stat">
            <span className="success-stat__icon">📈</span>
            <span className="success-stat__value">{totalSessions}</span>
            <span className="success-stat__label">Total Sessions</span>
          </div>
        </div>

        {/* ── Encouragement Cards ── */}
        <div className="encouragement-cards">
          {[
            {
              icon: '🧠',
              title: 'Knowledge Gained',
              text: 'Your brain has absorbed new information. Rest helps consolidate memory.',
              color: '#6C63FF',
            },
            {
              icon: '💪',
              title: 'Habit Building',
              text: "Consistency is key. You're building a powerful study habit day by day.",
              color: '#43D9AD',
            },
            {
              icon: '🚀',
              title: 'Keep Momentum',
              text: 'Schedule your next session to maintain your streak and reach your goals.',
              color: '#FFB347',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="encouragement-card"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            >
              <div
                className="encouragement-card__icon"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                {card.icon}
              </div>
              <h4 className="encouragement-card__title">{card.title}</h4>
              <p className="encouragement-card__text">{card.text}</p>
            </div>
          ))}
        </div>

        {/* ── Quote ── */}
        <div className="success-quote">
          <p className="quote-text">
            "The secret of getting ahead is getting started. The secret of getting started
            is breaking your complex overwhelming tasks into small manageable tasks."
          </p>
          <span className="quote-author">— Mark Twain</span>
        </div>

        {/* ── Action Buttons ── */}
        <div className="success-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/focus')}
          >
            ⏱️ Start Another Session
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            🏠 Back to Dashboard
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/progress')}
          >
            📊 View Progress
          </button>
        </div>

        {/* ── Next Steps ── */}
        <div className="next-steps">
          <h3 className="next-steps__title">What's next?</h3>
          <div className="next-steps__grid">
            {[
              { icon: '☕', label: 'Take a 5-min break',   action: () => {} },
              { icon: '💧', label: 'Drink some water',      action: () => {} },
              { icon: '🧘', label: 'Stretch for 2 minutes', action: () => {} },
              { icon: '✅', label: 'Update your tasks',      action: () => navigate('/tasks') },
            ].map((step, i) => (
              <button key={i} className="next-step-btn" onClick={step.action}>
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;
