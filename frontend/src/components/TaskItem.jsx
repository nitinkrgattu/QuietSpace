// ============================================
// TaskItem Component
// Individual task row with complete/delete actions
// ============================================

import './TaskItem.css';

/**
 * TaskItem - renders a single task with checkbox and delete button
 * @param {object} task - Task object { id, text, completed, priority, subject }
 * @param {function} onToggle - Callback to toggle completion
 * @param {function} onDelete - Callback to delete task
 */
const TaskItem = ({ task, onToggle, onDelete }) => {
  // Map priority to color
  const priorityColors = {
    high:   { bg: 'rgba(255, 101, 132, 0.12)', text: '#CC3355', label: 'High' },
    medium: { bg: 'rgba(255, 179, 71, 0.12)',  text: '#CC8A00', label: 'Medium' },
    low:    { bg: 'rgba(67, 217, 173, 0.12)',  text: '#2BA87A', label: 'Low' },
  };

  const priority = priorityColors[task.priority] || priorityColors.low;

  return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.completed ? 'task-checkbox--checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <span className="task-checkbox__check">✓</span>}
      </button>

      {/* Task Content */}
      <div className="task-content">
        <p className="task-text">{task.text}</p>
        <div className="task-meta">
          {/* Subject tag */}
          <span className="task-subject">{task.subject}</span>
          {/* Priority badge */}
          <span
            className="task-priority"
            style={{ background: priority.bg, color: priority.text }}
          >
            {priority.label}
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
