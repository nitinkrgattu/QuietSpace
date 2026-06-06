// ============================================
// DashboardPage
// Main home screen with real data from API
// Falls back to sensible defaults while loading
// ============================================

import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import useProgress from '../hooks/useProgress';
import useSessions from '../hooks/useSessions';
import useTasks from '../hooks/useTasks';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { userDisplayName } = useAuth();
  const { analytics, loading: progressLoading } = useProgress();
  const { totalSessions, totalHours } = useSessions();
  const { completedCount, totalCount } = useTasks();

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Use real analytics or sensible defaults
  const weeklyData    = analytics?.weekly_data    || [];
  const streak        = analytics?.streak         || { current: 0, longest: 0, last_studied: 'Never' };
  const dailyGoal     = analytics?.daily_goal     || { target: 4, completed: 0, percentage: 0 };
  const weeklyProgress = analytics?.weekly_progress || { target: 20, completed: 0 };

  const maxHours = weeklyData.length > 0
    ? Math.max(...weeklyData.map(d => d.hours), 1)
    : 1;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard">

          {/* ── Hero Welcome Section ── */}
          <section className="dashboard-hero">
            <div className="hero-text">
              <p className="hero-greeting">
                {getGreeting()}, {userDisplayName.split(' ')[0]} 👋
              </p>
              <h1 className="hero-title">Ready to focus today?</h1>
              <p className="hero-subtitle">
                {streak.current > 0
                  ? <>You're on a <strong>{streak.current}-day streak</strong>. Keep the momentum going!</>
                  : 'Start your first focus session to build your streak!'}
              </p>
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/focus')}>
                ⏱️ Start Focus Session
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/tasks')}>
                ✅ View Tasks
              </button>
            </div>
          </section>

          {/* ── Stats Grid ── */}
          <section className="dashboard-stats">
            <StatCard
              icon="🔥"
              label="Study Streak"
              value={`${streak.current} days`}
              subtitle={`Longest: ${streak.longest} days`}
              color="#FF6584"
              trend={streak.current > 0 ? `${streak.current} days` : 'Start today!'}
              trendUp={streak.current > 0}
              delay={0}
            />
            <StatCard
              icon="⏱️"
              label="Total Hours"
              value={`${totalHours}h`}
              subtitle="All time focus time"
              color="#6C63FF"
              trend={`${totalSessions} sessions`}
              trendUp={true}
              delay={100}
            />
            <StatCard
              icon="🎯"
              label="Sessions Done"
              value={totalSessions}
              subtitle="Focus sessions completed"
              color="#43D9AD"
              delay={200}
            />
            <StatCard
              icon="📅"
              label="Daily Goal"
              value={`${dailyGoal.completed}h / ${dailyGoal.target}h`}
              subtitle="Today's progress"
              color="#FFB347"
              progress={dailyGoal.percentage}
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

              {progressLoading ? (
                <div className="loading-placeholder">
                  <div className="loading-bar" />
                  <div className="loading-bar loading-bar--short" />
                </div>
              ) : weeklyData.length > 0 ? (
                <div className="week-chart">
                  {weeklyData.map((day) => (
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
              ) : (
                <div className="empty-chart">
                  <p>📊 No data yet. Complete your first session!</p>
                </div>
              )}

              <div className="week-summary">
                <ProgressBar
                  value={weeklyProgress.completed}
                  max={weeklyProgress.target}
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
                  <div className="streak-number">{streak.current}</div>
                  <div className="streak-info">
                    <p className="streak-label">days in a row</p>
                    <p className="streak-sub">
                      Last studied: {streak.last_studied || 'Never'}
                    </p>
                  </div>
                </div>
                <div className="streak-dots">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className="streak-dot-group">
                      <div className={`streak-dot ${i < streak.current ? 'streak-dot--active' : ''}`} />
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
                    { icon: '⏱️', label: 'Start Focus',  path: '/focus',              color: '#6C63FF' },
                    { icon: '✅', label: 'My Tasks',      path: '/tasks',              color: '#43D9AD' },
                    { icon: '📊', label: 'Progress',      path: '/progress',           color: '#FFB347' },
                    { icon: '🤖', label: 'AI Tips',       path: '/ai-recommendations', color: '#FF6584' },
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
                  {dailyGoal.completed}h completed of {dailyGoal.target}h target
                </p>
              </div>
              <span className="badge badge-warning">
                {Math.max(0, dailyGoal.target - dailyGoal.completed)}h remaining
              </span>
            </div>
            <ProgressBar
              value={dailyGoal.completed}
              max={dailyGoal.target}
              label="Daily progress"
              color="var(--gradient-warm)"
              size="lg"
              unit="hrs"
            />
            <div className="goal-cta">
              <p className="goal-message">
                {dailyGoal.percentage >= 100
                  ? '🎉 Daily goal achieved! Amazing work!'
                  : `💪 You're ${dailyGoal.percentage}% there! Keep going!`}
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/focus')}>
                Continue Studying
              </button>
            </div>
          </section>

          {/* ── Task Summary ── */}
          {totalCount > 0 && (
            <section className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">✅ Task Summary</h3>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => navigate('/tasks')}
                >
                  View All
                </button>
              </div>
              <ProgressBar
                value={completedCount}
                max={totalCount}
                label={`${completedCount} of ${totalCount} tasks completed`}
                color="var(--color-success)"
                size="md"
                unit="%"
              />
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
