// ============================================
// DashboardPage
// Main home screen with stats, goals, and quick actions
// ============================================

import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { mockUser, dashboardStats, weeklyFocusData } from '../data/mockData';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Max hours in week for chart scaling
  const maxHours = Math.max(...weeklyFocusData.map(d => d.hours), 1);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard">

          {/* ── Hero Welcome Section ── */}
          <section className="dashboard-hero">
            <div className="hero-text">
              <p className="hero-greeting">{getGreeting()}, {mockUser.name.split(' ')[0]} 👋</p>
              <h1 className="hero-title">Ready to focus today?</h1>
              <p className="hero-subtitle">
                You're on a <strong>{dashboardStats.studyStreak.current}-day streak</strong>. Keep the momentum going!
              </p>
            </div>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/focus')}
              >
                ⏱️ Start Focus Session
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate('/tasks')}
              >
                ✅ View Tasks
              </button>
            </div>
          </section>

          {/* ── Stats Grid ── */}
          <section className="dashboard-stats">
            <StatCard
              icon="🔥"
              label="Study Streak"
              value={`${dashboardStats.studyStreak.current} days`}
              subtitle={`Longest: ${dashboardStats.studyStreak.longest} days`}
              color="#FF6584"
              trend="3 days"
              trendUp={true}
              delay={0}
            />
            <StatCard
              icon="⏱️"
              label="Total Hours"
              value={`${dashboardStats.totalHours}h`}
              subtitle="All time focus time"
              color="#6C63FF"
              trend="12h this week"
              trendUp={true}
              delay={100}
            />
            <StatCard
              icon="🎯"
              label="Sessions Done"
              value={dashboardStats.totalSessions}
              subtitle="Focus sessions completed"
              color="#43D9AD"
              trend="5 this week"
              trendUp={true}
              delay={200}
            />
            <StatCard
              icon="📅"
              label="Daily Goal"
              value={`${dashboardStats.dailyGoal.completed}h / ${dashboardStats.dailyGoal.target}h`}
              subtitle="Today's progress"
              color="#FFB347"
              progress={dashboardStats.dailyGoal.percentage}
              delay={300}
            />
          </section>

          {/* ── Two Column Layout ── */}
          <div className="dashboard-grid">

            {/* Weekly Progress Card */}
            <section className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">📊 Weekly Progress</h3>
                <span className="badge badge-primary">This Week</span>
              </div>

              {/* Weekly bar chart */}
              <div className="week-chart">
                {weeklyFocusData.map((day) => (
                  <div key={day.day} className="week-chart__bar-group">
                    <div className="week-chart__bar-wrapper">
                      <div
                        className="week-chart__bar"
                        style={{ height: `${(day.hours / maxHours) * 100}%` }}
                        title={`${day.hours}h`}
                      >
                        {day.hours > 0 && (
                          <span className="week-chart__bar-label">{day.hours}h</span>
                        )}
                      </div>
                    </div>
                    <span className="week-chart__day">{day.day}</span>
                  </div>
                ))}
              </div>

              {/* Weekly summary */}
              <div className="week-summary">
                <ProgressBar
                  value={dashboardStats.weeklyProgress.completed}
                  max={dashboardStats.weeklyProgress.target}
                  label="Weekly goal"
                  color="var(--color-primary)"
                  size="md"
                  unit="hrs"
                />
              </div>
            </section>

            {/* Right column */}
            <div className="dashboard-right">

              {/* Study Streak Card */}
              <section className="dashboard-card streak-card">
                <div className="card-header">
                  <h3 className="card-title">🔥 Study Streak</h3>
                </div>
                <div className="streak-display">
                  <div className="streak-number">{dashboardStats.studyStreak.current}</div>
                  <div className="streak-info">
                    <p className="streak-label">days in a row</p>
                    <p className="streak-sub">Last studied: {dashboardStats.studyStreak.lastStudied}</p>
                  </div>
                </div>
                {/* Streak dots */}
                <div className="streak-dots">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className="streak-dot-group">
                      <div className={`streak-dot ${i < dashboardStats.studyStreak.current ? 'streak-dot--active' : ''}`} />
                      <span className="streak-dot-label">{d}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions Card */}
              <section className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">⚡ Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  {[
                    { icon: '⏱️', label: 'Start Focus',    path: '/focus',              color: '#6C63FF' },
                    { icon: '✅', label: 'My Tasks',       path: '/tasks',              color: '#43D9AD' },
                    { icon: '📊', label: 'Progress',       path: '/progress',           color: '#FFB347' },
                    { icon: '🤖', label: 'AI Tips',        path: '/ai-recommendations', color: '#FF6584' },
                  ].map((action) => (
                    <button
                      key={action.path}
                      className="quick-action"
                      onClick={() => navigate(action.path)}
                      style={{ '--action-color': action.color }}
                    >
                      <span className="quick-action__icon">{action.icon}</span>
                      <span className="quick-action__label">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ── Daily Goal Card ── */}
          <section className="dashboard-card daily-goal-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">🎯 Today's Study Goal</h3>
                <p className="card-subtitle">
                  {dashboardStats.dailyGoal.completed}h completed of {dashboardStats.dailyGoal.target}h target
                </p>
              </div>
              <span className="badge badge-warning">
                {dashboardStats.dailyGoal.target - dashboardStats.dailyGoal.completed}h remaining
              </span>
            </div>
            <ProgressBar
              value={dashboardStats.dailyGoal.completed}
              max={dashboardStats.dailyGoal.target}
              label="Daily progress"
              color="var(--gradient-warm)"
              size="lg"
              unit="hrs"
            />
            <div className="goal-cta">
              <p className="goal-message">
                💪 You're {dashboardStats.dailyGoal.percentage}% there! One more session and you'll hit your goal.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/focus')}
              >
                Continue Studying
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
