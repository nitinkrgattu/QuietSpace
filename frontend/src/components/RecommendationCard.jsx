// ============================================
// RecommendationCard Component
// Displays an AI-generated study recommendation
// ============================================

import './RecommendationCard.css';

/**
 * RecommendationCard - shows a single AI recommendation
 * @param {object} recommendation - { icon, title, description, tag, color }
 * @param {number} delay - Animation delay in ms
 */
const RecommendationCard = ({ recommendation, delay = 0 }) => {
  const { icon, title, description, tag, color } = recommendation;

  return (
    <div
      className="rec-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Colored left border accent */}
      <div className="rec-card__border" style={{ background: color }} />

      {/* Icon */}
      <div
        className="rec-card__icon"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="rec-card__content">
        <div className="rec-card__header">
          <h4 className="rec-card__title">{title}</h4>
          <span
            className="rec-card__tag"
            style={{ background: `${color}18`, color }}
          >
            {tag}
          </span>
        </div>
        <p className="rec-card__description">{description}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
