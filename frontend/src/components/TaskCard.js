import React, { useState } from "react";
import {
  FiEdit2, FiTrash2, FiCalendar, FiTag, FiChevronDown, FiClock, FiCheckCircle, FiCircle,
} from "react-icons/fi";

const STATUS_FLOW = {
  Pending: "In-Progress",
  "In-Progress": "Completed",
  Completed: "Pending",
};

const STATUS_COLORS = {
  Pending: "status-pending",
  "In-Progress": "status-inprogress",
  Completed: "status-completed",
};

const PRIORITY_COLORS = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
};

const STATUS_ICONS = {
  Pending: <FiCircle size={13} />,
  "In-Progress": <FiClock size={13} />,
  Completed: <FiCheckCircle size={13} />,
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const statuses = ["Pending", "In-Progress", "Completed"];

  const handleStatusClick = (status) => {
    if (status !== task.status) onStatusChange(task._id, status);
    setShowDropdown(false);
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <div className={`task-card ${task.status === "Completed" ? "task-completed" : ""}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <div className="status-wrapper">
            <button
              className={`badge status-badge ${STATUS_COLORS[task.status]}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {STATUS_ICONS[task.status]}
              {task.status}
              <FiChevronDown size={11} />
            </button>
            {showDropdown && (
              <div className="status-dropdown">
                {statuses.map((s) => (
                  <button
                    key={s}
                    className={`dropdown-item ${s === task.status ? "active" : ""}`}
                    onClick={() => handleStatusClick(s)}
                  >
                    {STATUS_ICONS[s]} {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className={`badge priority-badge ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="task-actions">
          <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">
            <FiEdit2 size={15} />
          </button>
          <button className="icon-btn delete-btn" onClick={() => onDelete(task._id)} title="Delete">
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-footer">
        {task.dueDate && (
          <div className={`task-due ${isOverdue ? "overdue" : ""}`}>
            <FiCalendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            {isOverdue && <span className="overdue-label">Overdue</span>}
          </div>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            <FiTag size={12} />
            {task.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
