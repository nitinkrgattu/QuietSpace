// ============================================
// ProgressPage
// Weekly focus hours, streaks, sessions, milestones
// ============================================

import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { dashboardStats, weeklyFocusData, milestones } from '../data/mockData';
import './ProgressPage.css';

const ProgressPage = () => {
  // Max hours for chart scaling
  const maxHours = Math.max(...weeklyFocusData.map(d => d.hours), 1);

  // Total weekly hours
  const totalWeeklyHours = weeklyFocusData.reduce((sum, d) => sum + d.hours, 0);
  const totalWeeklySessions = weeklyFocusData.reduce((sum, d) => sum + d.sessions, 0);

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

          {/* ── Stats Row ── */}
          <section className="progress-stats">
            <StatCard
              icon="⏱️"
              label="Weekly Focus Hours"
              value={`${totalWeeklyHours}h`}
              subtitle="Total this week"
              color="#6C63FF"
              trend="2.5h vs last week"
              trendUp={true}
              delay={0}
            />
            <StatCard
              icon="🔥"
              label="Current Streak"
              value={`${dashboardStats.studyStreak.current} days`}
              subtitle={`Best: ${dashboardStats.studyStreak.longest} days`}
              color="#FF6584"
              trend="Personal best!"
              trendUp={true}
              delay={100}
            />
            <StatCard
              icon="🎯"
              label="Sessions Completed"
              value={totalWeeklySessions}
              subtitle="This week"
              color="#43D9AD"
              trend="3 more than last week"
              trendUp={true}
              delay={200}
            />
            <StatCard
              icon="📈"
              label="All-Time Hours"
              value={`${dashboardStats.totalHours}h`}
              subtitle={`${dashboardStats.totalSessions} total sessions`}
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

            {/* Bar Chart */}
            <div className="chart-container">
              {weeklyFocusData.map((day, i) => (
                <div key={day.day} className="chart-column">
                  {/* Bar */}
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
                  {/* Day label */}
                  <span className="chart-day">{day.day}</span>
                  {/* Sessions count */}
                  <span className="chart-sessions">
                    {day.sessions > 0 ? `${day.sessions}×` : '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart legend */}
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
                      {dashboardStats.dailyGoal.completed}h / {dashboardStats.dailyGoal.target}h
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardStats.dailyGoal.completed}
                    max={dashboardStats.dailyGoal.target}
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
                      {dashboardStats.weeklyProgress.completed}h / {dashboardStats.weeklyProgress.target}h
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardStats.weeklyProgress.completed}
                    max={dashboardStats.weeklyProgress.target}
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
                      {dashboardStats.studyStreak.current} / 14 days
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardStats.studyStreak.current}
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
                      {dashboardStats.totalSessions} / 50
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardStats.totalSessions}
                    max={50}
                    color="#FFB347"
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
              <div className="daily-breakdown">
                {weeklyFocusData.map((day) => (
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
            </section>
          </div>

          {/* ── Milestones ── */}
          <section className="progress-card">
            <div className="progress-card__header">
              <h3 className="progress-card__title">🏆 Achievements & Milestones</h3>
              <span className="badge badge-success">
                {milestones.filter(m => m.achieved).length} / {milestones.length} earned
              </span>
            </div>
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
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
