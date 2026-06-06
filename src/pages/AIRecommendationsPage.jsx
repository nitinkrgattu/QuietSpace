// ============================================
// AIRecommendationsPage
// Mock AI-generated study suggestions and challenges
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import ProgressBar from '../components/ProgressBar';
import {
  aiRecommendations,
  weeklyChallenge,
  suggestedStudyTimes,
  mockUser,
} from '../data/mockData';
import './AIRecommendationsPage.css';

const AIRecommendationsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filter categories
  const filters = [
    { key: 'all',         label: 'All Tips' },
    { key: 'focus',       label: 'Focus' },
    { key: 'schedule',    label: 'Schedule' },
    { key: 'break',       label: 'Wellness' },
    { key: 'subject',     label: 'Learning' },
    { key: 'environment', label: 'Environment' },
  ];

  // Filtered recommendations
  const filtered = activeFilter === 'all'
    ? aiRecommendations
    : aiRecommendations.filter(r => r.type === activeFilter);

  // Simulate AI refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="ai-page">

          {/* ── Header ── */}
          <div className="ai-header">
            <div className="ai-header__text">
              <div className="ai-badge">
                <span className="ai-badge__dot" />
                AI Powered
              </div>
              <h1 className="ai-title">Study Recommendations</h1>
              <p className="ai-subtitle">
                Personalised insights based on {mockUser.name}'s study patterns and performance data
              </p>
            </div>
            <button
              className={`refresh-btn ${refreshing ? 'refresh-btn--loading' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span className={`refresh-icon ${refreshing ? 'refresh-icon--spin' : ''}`}>↻</span>
              {refreshing ? 'Analysing...' : 'Refresh AI'}
            </button>
          </div>

          {/* ── AI Summary Card ── */}
          <div className="ai-summary">
            <div className="ai-summary__icon">🤖</div>
            <div className="ai-summary__content">
              <h3 className="ai-summary__title">Your Weekly AI Analysis</h3>
              <p className="ai-summary__text">
                Based on your <strong>13.5 hours</strong> of focus time this week and a{' '}
                <strong>7-day streak</strong>, our AI has identified 5 key areas to optimise
                your study performance. Your peak productivity window is{' '}
                <strong>9–11 AM on weekdays</strong>.
              </p>
            </div>
            <div className="ai-summary__score">
              <div className="score-ring">
                <span className="score-value">82</span>
                <span className="score-label">Focus Score</span>
              </div>
            </div>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="ai-filters">
            {filters.map(f => (
              <button
                key={f.key}
                className={`ai-filter-btn ${activeFilter === f.key ? 'ai-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* ── Recommendations List ── */}
          <div className="recommendations-list">
            {filtered.map((rec, i) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                delay={i * 80}
              />
            ))}
          </div>

          {/* ── Two Column: Study Times + Challenge ── */}
          <div className="ai-grid">

            {/* Suggested Study Times */}
            <section className="ai-card">
              <div className="ai-card__header">
                <h3 className="ai-card__title">⏰ Best Study Times</h3>
                <span className="badge badge-primary">Today</span>
              </div>
              <div className="study-times">
                {suggestedStudyTimes.map((slot, i) => (
                  <div key={i} className="time-slot">
                    <div className="time-slot__left">
                      <span className="time-slot__icon">{slot.icon}</span>
                      <div>
                        <p className="time-slot__time">{slot.time}</p>
                        <p className="time-slot__label">{slot.label}</p>
                      </div>
                    </div>
                    <div className="time-slot__right">
                      <div className="time-slot__bar-track">
                        <div
                          className="time-slot__bar-fill"
                          style={{
                            width: `${slot.score}%`,
                            background: slot.score >= 80
                              ? 'var(--gradient-success)'
                              : slot.score >= 60
                              ? 'var(--gradient-warm)'
                              : 'var(--gradient-accent)',
                          }}
                        />
                      </div>
                      <span
                        className="time-slot__score"
                        style={{
                          color: slot.score >= 80 ? '#2BA87A'
                            : slot.score >= 60 ? '#CC8A00'
                            : '#CC3355',
                        }}
                      >
                        {slot.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekly Challenge */}
            <section className="ai-card challenge-card">
              <div className="ai-card__header">
                <h3 className="ai-card__title">🏆 Weekly Challenge</h3>
                <span className="badge badge-warning">{weeklyChallenge.daysLeft} days left</span>
              </div>

              <div className="challenge-content">
                <h4 className="challenge-title">{weeklyChallenge.title}</h4>
                <p className="challenge-desc">{weeklyChallenge.description}</p>

                <div className="challenge-progress">
                  <ProgressBar
                    value={weeklyChallenge.progress}
                    max={weeklyChallenge.total}
                    label={`${weeklyChallenge.progress} of ${weeklyChallenge.total} days completed`}
                    color="#FFB347"
                    size="lg"
                    unit="%"
                  />
                </div>

                {/* Day indicators */}
                <div className="challenge-days">
                  {Array.from({ length: weeklyChallenge.total }).map((_, i) => (
                    <div
                      key={i}
                      className={`challenge-day ${i < weeklyChallenge.progress ? 'challenge-day--done' : i === weeklyChallenge.progress ? 'challenge-day--current' : ''}`}
                    >
                      {i < weeklyChallenge.progress ? '✓' : i + 1}
                    </div>
                  ))}
                </div>

                <div className="challenge-reward">
                  <span className="reward-label">Reward:</span>
                  <span className="reward-value">{weeklyChallenge.reward}</span>
                </div>
              </div>

              <button
                className="btn btn-primary challenge-btn"
                onClick={() => navigate('/focus')}
              >
                ⏱️ Start Today's Session
              </button>
            </section>
          </div>

          {/* ── Recommended Focus Duration ── */}
          <section className="ai-card focus-rec-card">
            <div className="ai-card__header">
              <h3 className="ai-card__title">🎯 Recommended Focus Plan for Today</h3>
            </div>
            <div className="focus-plan">
              {[
                { time: '9:00 AM',  task: 'Mathematics Assignment',    duration: '25 min', type: 'focus' },
                { time: '9:30 AM',  task: 'Short Break',               duration: '5 min',  type: 'break' },
                { time: '9:35 AM',  task: 'Computer Science Review',   duration: '25 min', type: 'focus' },
                { time: '10:05 AM', task: 'Short Break',               duration: '5 min',  type: 'break' },
                { time: '10:10 AM', task: 'Essay Writing',             duration: '25 min', type: 'focus' },
                { time: '10:40 AM', task: 'Long Break',                duration: '15 min', type: 'long-break' },
              ].map((item, i) => (
                <div key={i} className={`plan-item plan-item--${item.type}`}>
                  <span className="plan-time">{item.time}</span>
                  <div className="plan-bar" />
                  <div className="plan-content">
                    <p className="plan-task">{item.task}</p>
                    <span className="plan-duration">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
