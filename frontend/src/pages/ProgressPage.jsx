// ============================================
// ProgressPage
// Real analytics from API — weekly focus, streaks, milestones
// ============================================

import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import useProgress from '../hooks/useProgress';
import useSessions from '../hooks/useSessions';
import useTasks from '../hooks/useTasks';
import './ProgressPage.css';

const ProgressPage = () => {
  const { analytics, loading, error } = useProgress();
  const { totalSessions, totalHours } = useSessions();
  const { completionPct } = useTasks();

  // Use real data or defaults
  const weeklyData     = analytics?.weekly_data     || [];
  const streak         = analytics?.streak          || { current: 0, longest: 0 };
  const dailyGoal      = analytics?.daily_goal      || { target: 4, completed: 0 };
  const weeklyProgress = analytics?.weekly_progress || { target: 20, completed: 0 };
  const milestones     = analytics?.milestones      || [];

  const maxHours = weeklyData.length > 0
    ? Math.max(...weeklyData.map(d => d.hours), 1)
    : 1;

  const totalWeeklyHours    = weeklyData.reduce((sum, d) => sum + (d.hours || 0), 0);
  const totalWeeklySessions = weeklyData.reduce((sum, d) => sum + (d.sessions || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="progress-page">

          {/* ── Header ── */}
          <div className="progress-header">
            <div>
              <h1 className="progress-title">Progress Tracking</h1>
              <p className="progress-subtitle">
                Monitor your focus journey and celebrate your achievements
              </p>
            </div>
            <div className="progress-period">
              <span className="period-badge">📅 This Week</span>
            </div>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="error-banner" role="alert">⚠️ {error}</div>
          )}

          {/* ── Stats Row ── */}
          <section className="progress-stats">
            <StatCard
              icon="⏱️"
              label="Weekly Focus Hours"
              value={`${totalWeeklyHours}h`}
              subtitle="Total this week"
              color="#6C63FF"
              delay={0}
            />
            <StatCard
              icon="🔥"
              label="Current Streak"
              value={`${streak.current} days`}
              subtitle={`Best: ${streak.longest} days`}
              color="#FF6584"
              delay={100}
            />
            <StatCard
              icon="🎯"
              label="Sessions Completed"
              value={totalWeeklySessions}
              subtitle="This week"
              color="#43D9AD"
              delay={200}
            />
            <StatCard
              icon="📈"
              label="All-Time Hours"
              value={`${totalHours}h`}
              subtitle={`${totalSessions} total sessions`}
              color="#FFB347"
              delay={300}
            />
          </section>

          {/* ── Weekly Chart ── */}
          <section className="progress-card">
            <div className="progress-card__header">
              <h3 className="progress-card__title">📊 Weekly Focus Hours</h3>
              <span className="badge badge-primary">{totalWeeklyHours}h total</span>
            </div>

            {loading ? (
              <div className="loading-placeholder">
                <div className="loading-bar" />
                <div className="loading-bar loading-bar--short" />
              </div>
            ) : weeklyData.length > 0 ? (
              <div className="chart-container">
                {weeklyData.map((day, i) => (
                  <div key={day.day} className="chart-column">
                    <div className="chart-bar-area">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${(day.hours / maxHours) * 100}%`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      >
                        {day.hours > 0 && (
                          <span className="chart-bar__tooltip">{day.hours}h</span>
                        )}
                      </div>
                    </div>
                    <span className="chart-day">{day.day}</span>
                    <span className="chart-sessions">
                      {day.sessions > 0 ? `${day.sessions}×` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>📊 No sessions recorded yet. Start your first focus session!</p>
              </div>
            )}

            <div className="chart-legend">
              <div className="legend-bar" />
              <span className="legend-text">Focus hours per day</span>
              <span className="legend-sessions">× = sessions</span>
            </div>
          </section>

          {/* ── Two Column ── */}
          <div className="progress-grid">

            {/* Goals Progress */}
            <section className="progress-card">
              <div className="progress-card__header">
                <h3 className="progress-card__title">🎯 Goals Progress</h3>
              </div>
              <div className="goals-list">
                <div className="goal-item">
                  <div className="goal-item__header">
                    <span className="goal-item__label">Daily Goal</span>
                    <span className="goal-item__value">
                      {dailyGoal.completed}h / {dailyGoal.target}h
                    </span>
                  </div>
                  <ProgressBar
                    value={dailyGoal.completed}
                    max={dailyGoal.target}
                    color="#6C63FF"
                    size="md"
                    showLabel={false}
                    unit="hrs"
                  />
                </div>
                <div className="goal-item">
                  <div className="goal-item__header">
                    <span className="goal-item__label">Weekly Goal</span>
                    <span className="goal-item__value">
                      {weeklyProgress.completed}h / {weeklyProgress.target}h
                    </span>
                  </div>
                  <ProgressBar
                    value={weeklyProgress.completed}
                    max={weeklyProgress.target}
                    color="#43D9AD"
                    size="md"
                    showLabel={false}
                    unit="hrs"
                  />
                </div>
                <div className="goal-item">
                  <div className="goal-item__header">
                    <span className="goal-item__label">Streak Goal (14 days)</span>
                    <span className="goal-item__value">
                      {streak.current} / 14 days
                    </span>
                  </div>
                  <ProgressBar
                    value={streak.current}
                    max={14}
                    color="#FF6584"
                    size="md"
                    showLabel={false}
                    unit="%"
                  />
                </div>
                <div className="goal-item">
                  <div className="goal-item__header">
                    <span className="goal-item__label">Sessions Goal (50)</span>
                    <span className="goal-item__value">
                      {totalSessions} / 50
                    </span>
                  </div>
                  <ProgressBar
                    value={totalSessions}
                    max={50}
                    color="#FFB347"
                    size="md"
                    showLabel={false}
                    unit="%"
                  />
                </div>
                <div className="goal-item">
                  <div className="goal-item__header">
                    <span className="goal-item__label">Task Completion Rate</span>
                    <span className="goal-item__value">{completionPct}%</span>
                  </div>
                  <ProgressBar
                    value={completionPct}
                    max={100}
                    color="#4FC3F7"
                    size="md"
                    showLabel={false}
                    unit="%"
                  />
                </div>
              </div>
            </section>

            {/* Daily Breakdown */}
            <section className="progress-card">
              <div className="progress-card__header">
                <h3 className="progress-card__title">📅 Daily Breakdown</h3>
              </div>
              {weeklyData.length > 0 ? (
                <div className="daily-breakdown">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="breakdown-row">
                      <span className="breakdown-day">{day.day}</span>
                      <div className="breakdown-bar-track">
                        <div
                          className="breakdown-bar-fill"
                          style={{ width: `${(day.hours / maxHours) * 100}%` }}
                        />
                      </div>
                      <span className="breakdown-hours">
                        {day.hours > 0 ? `${day.hours}h` : '—'}
                      </span>
                      <span className="breakdown-sessions">
                        {day.sessions > 0 ? `${day.sessions} sessions` : 'No sessions'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-chart">
                  <p>No data yet for this week.</p>
                </div>
              )}
            </section>
          </div>

          {/* ── Milestones ── */}
          <section className="progress-card">
            <div className="progress-card__header">
              <h3 className="progress-card__title">🏆 Achievements & Milestones</h3>
              {milestones.length > 0 && (
                <span className="badge badge-success">
                  {milestones.filter(m => m.achieved).length} / {milestones.length} earned
                </span>
              )}
            </div>
            {milestones.length > 0 ? (
              <div className="milestones-grid">
                {milestones.map((m, i) => (
                  <div
                    key={m.id}
                    className={`milestone-card ${m.achieved ? 'milestone-card--achieved' : 'milestone-card--locked'}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="milestone-icon">{m.icon}</span>
                    <p className="milestone-title">{m.title}</p>
                    <p className="milestone-desc">{m.description}</p>
                    {m.achieved ? (
                      <span className="milestone-status milestone-status--done">✓ Earned</span>
                    ) : (
                      <span className="milestone-status milestone-status--locked">🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>🏆 Complete sessions to earn achievements!</p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
