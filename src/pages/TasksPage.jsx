// ============================================
// TasksPage
// Task management with add, complete, delete, and progress
// ============================================

import { useState } from 'react';
import TaskItem from '../components/TaskItem';
import ProgressBar from '../components/ProgressBar';
import { initialTasks } from '../data/mockData';
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks]         = useState(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newSubject, setNewSubject]   = useState('');
  const [filter, setFilter]           = useState('all'); // 'all' | 'active' | 'completed'
  const [showForm, setShowForm]       = useState(false);

  // Computed stats
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount     = tasks.length;
  const completionPct  = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id:        Date.now(),
      text:      newTaskText.trim(),
      completed: false,
      priority:  newPriority,
      subject:   newSubject.trim() || 'General',
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    setNewSubject('');
    setNewPriority('medium');
    setShowForm(false);
  };

  // Toggle task completion
  const handleToggle = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  // Delete task
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Clear all completed
  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="tasks-page">

          {/* ── Header ── */}
          <div className="tasks-header">
            <div>
              <h1 className="tasks-title">Task Manager</h1>
              <p className="tasks-subtitle">
                Organise your study tasks and track completion
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(prev => !prev)}
            >
              {showForm ? '✕ Cancel' : '+ Add Task'}
            </button>
          </div>

          {/* ── Progress Overview ── */}
          <div className="tasks-overview">
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="overview-stat__value">{totalCount}</span>
                <span className="overview-stat__label">Total</span>
              </div>
              <div className="overview-stat overview-stat--success">
                <span className="overview-stat__value">{completedCount}</span>
                <span className="overview-stat__label">Done</span>
              </div>
              <div className="overview-stat overview-stat--pending">
                <span className="overview-stat__value">{totalCount - completedCount}</span>
                <span className="overview-stat__label">Pending</span>
              </div>
            </div>
            <div className="overview-progress">
              <ProgressBar
                value={completedCount}
                max={totalCount || 1}
                label="Completion rate"
                color="var(--color-success)"
                size="lg"
                unit="%"
              />
            </div>
          </div>

          {/* ── Add Task Form ── */}
          {showForm && (
            <div className="add-task-form">
              <h3 className="form-title">➕ New Task</h3>
              <form onSubmit={handleAddTask}>
                <div className="form-row">
                  <div className="form-field form-field--wide">
                    <label className="field-label">Task description *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="What do you need to study or complete?"
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      autoFocus
                      maxLength={120}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="field-label">Subject</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Mathematics"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      maxLength={40}
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Priority</label>
                    <select
                      className="field-input field-select"
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value)}
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                  </div>
                  <div className="form-field form-field--btn">
                    <button type="submit" className="btn btn-primary">
                      Add Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── Filter Tabs ── */}
          <div className="tasks-filters">
            <div className="filter-tabs">
              {[
                { key: 'all',       label: `All (${totalCount})` },
                { key: 'active',    label: `Active (${totalCount - completedCount})` },
                { key: 'completed', label: `Done (${completedCount})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`filter-tab ${filter === tab.key ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                className="clear-btn"
                onClick={handleClearCompleted}
              >
                🗑 Clear completed
              </button>
            )}
          </div>

          {/* ── Task List ── */}
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="tasks-empty">
                <span className="tasks-empty__icon">
                  {filter === 'completed' ? '🎉' : '📝'}
                </span>
                <p className="tasks-empty__text">
                  {filter === 'completed'
                    ? 'No completed tasks yet. Keep going!'
                    : filter === 'active'
                    ? 'All tasks completed! Great work! 🎉'
                    : 'No tasks yet. Add your first task above!'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskItem
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            )}
          </div>

          {/* ── Priority Legend ── */}
          <div className="priority-legend">
            <span className="legend-title">Priority:</span>
            {[
              { color: '#CC3355', bg: 'rgba(255,101,132,0.12)', label: 'High' },
              { color: '#CC8A00', bg: 'rgba(255,179,71,0.12)',  label: 'Medium' },
              { color: '#2BA87A', bg: 'rgba(67,217,173,0.12)',  label: 'Low' },
            ].map(p => (
              <span
                key={p.label}
                className="legend-item"
                style={{ background: p.bg, color: p.color }}
              >
                {p.label}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TasksPage;
