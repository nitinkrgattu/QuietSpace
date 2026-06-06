// ============================================
// StatCard Component
// Reusable card for displaying statistics
// ============================================

import './StatCard.css';

/**
 * StatCard - displays a single metric with icon, value, label, and optional progress
 * @param {string} icon - Emoji icon
 * @param {string} label - Card label/title
 * @param {string|number} value - Main metric value
 * @param {string} subtitle - Secondary text
 * @param {string} color - Accent color (CSS variable or hex)
 * @param {number} progress - Optional progress percentage (0-100)
 * @param {string} trend - Optional trend text (e.g. "+12%")
 * @param {boolean} trendUp - Whether trend is positive
 */
const StatCard = ({
  icon,
  label,
  value,
  subtitle,
  color = 'var(--color-primary)',
  progress,
  trend,
  trendUp = true,
  delay = 0,
}) => {
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon Badge */}
      <div className="stat-card__icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>

      {/* Content */}
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <div className="stat-card__value-row">
          <h3 className="stat-card__value">{value}</h3>
          {trend && (
            <span className={`stat-card__trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>

      {/* Optional Progress Bar */}
      {progress !== undefined && (
        <div className="stat-card__progress">
          <div className="stat-card__progress-track">
            <div
              className="stat-card__progress-fill"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: color,
              }}
            />
          </div>
          <span className="stat-card__progress-label">{progress}%</span>
        </div>
      )}

      {/* Decorative accent line */}
      <div className="stat-card__accent" style={{ background: color }} />
    </div>
  );
};

export default StatCard;
