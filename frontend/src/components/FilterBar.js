import React from "react";
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiX } from "react-icons/fi";

const FilterBar = ({ filters, onChange, onReset }) => {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value, page: 1 });
  const toggleOrder = () => handleChange("order", filters.order === "asc" ? "desc" : "asc");

  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.sortBy !== "createdAt";

  return (
    <div className="filter-bar">
      <div className="search-box">
        <FiSearch size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
        {filters.search && (
          <button className="clear-search" onClick={() => handleChange("search", "")}>
            <FiX size={14} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <FiFilter size={14} />
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
          <button className="sort-order-btn" onClick={toggleOrder} title={`Sort ${filters.order === "asc" ? "Descending" : "Ascending"}`}>
            {filters.order === "asc" ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
          </button>
        </div>

        {hasActiveFilters && (
          <button className="btn-reset" onClick={onReset}>
            <FiX size={14} /> Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
