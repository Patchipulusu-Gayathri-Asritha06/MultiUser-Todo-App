import React from "react";
import { FiCircle, FiClock, FiCheckCircle, FiList } from "react-icons/fi";

const StatsBar = ({ stats }) => {
  const total = (stats?.Pending || 0) + (stats?.["In-Progress"] || 0) + (stats?.Completed || 0);

  const items = [
    { label: "Total", value: total, icon: <FiList size={18} />, cls: "stat-total" },
    { label: "Pending", value: stats?.Pending || 0, icon: <FiCircle size={18} />, cls: "stat-pending" },
    { label: "In-Progress", value: stats?.["In-Progress"] || 0, icon: <FiClock size={18} />, cls: "stat-inprogress" },
    { label: "Completed", value: stats?.Completed || 0, icon: <FiCheckCircle size={18} />, cls: "stat-completed" },
  ];

  return (
    <div className="stats-bar">
      {items.map((item) => (
        <div key={item.label} className={`stat-card ${item.cls}`}>
          <div className="stat-icon">{item.icon}</div>
          <div className="stat-content">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
