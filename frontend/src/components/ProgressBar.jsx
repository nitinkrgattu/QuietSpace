// ============================================
// ProgressBar Component
// Animated progress bar with label and value
// ============================================

import './ProgressBar.css';

/**
 * ProgressBar - animated horizontal progress indicator
 * @param {number} value - Current value
 * @param {number} max - Maximum value
 * @param {string} label - Label text
 * @param {string} color - Bar fill color
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} showLabel - Whether to show label
 * @param {boolean} showValue - Whether to show value text
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  color = 'var(--color-primary)',
  size = 'md',
  showLabel = true,
  showValue = true,
  unit = '%',
  animated = true,
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`progress-bar-wrapper progress-bar--${size}`}>
      {/* Header row */}
      {(showLabel || showValue) && (
        <div className="progress-bar__header">
          {showLabel && label && (
            <span className="progress-bar__label">{label}</span>
          )}
          {showValue && (
            <span className="progress-bar__value" style={{ color }}>
              {unit === '%' ? `${percentage}%` : `${value} / ${max} ${unit}`}
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill ${animated ? 'progress-bar__fill--animated' : ''}`}
          style={{
            width: `${percentage}%`,
            background: color,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
