import React from "react";
import { SUBJECTS } from "../../utils/constants";

const AssignmentFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Filter by Subject:</label>
        <select
          value={filters.subject}
          onChange={(e) => onFilterChange("subject", e.target.value)}
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Filter by Status:</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
        >
          <option value="deadline-asc">Deadline (Earliest First)</option>
          <option value="deadline-desc">Deadline (Latest First)</option>
          <option value="uploaded-desc">Recently Added</option>
        </select>
      </div>
    </div>
  );
};

export default AssignmentFilters;