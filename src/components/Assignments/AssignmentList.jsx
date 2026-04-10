import React, { useState, useMemo } from "react";
import AssignmentCard from "./AssignmentCard";
import AssignmentFilters from "./AssignmentFilters";
import Loader from "../UI/Loader";

const AssignmentList = ({
  assignments,
  loading,
  isCR,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [filters, setFilters] = useState({
    subject: "",
    status: "",
    sortBy: "deadline-asc",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters and sorting
  const filteredAssignments = useMemo(() => {
    let result = [...assignments];

    // Filter by subject
    if (filters.subject) {
      result = result.filter((a) => a.subject === filters.subject);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }

    // Sort
    result.sort((a, b) => {
      const deadlineA = a.deadline?.toDate
        ? a.deadline.toDate()
        : new Date(a.deadline);
      const deadlineB = b.deadline?.toDate
        ? b.deadline.toDate()
        : new Date(b.deadline);
      const uploadedA = a.uploadedDate?.toDate
        ? a.uploadedDate.toDate()
        : new Date(a.uploadedDate);
      const uploadedB = b.uploadedDate?.toDate
        ? b.uploadedDate.toDate()
        : new Date(b.uploadedDate);

      switch (filters.sortBy) {
        case "deadline-desc":
          return deadlineB - deadlineA;
        case "uploaded-desc":
          return uploadedB - uploadedA;
        default:
          return deadlineA - deadlineB;
      }
    });

    return result;
  }, [assignments, filters]);

  if (loading) return <Loader />;

  return (
    <div className="assignment-list-container">
      <AssignmentFilters filters={filters} onFilterChange={handleFilterChange} />

      {filteredAssignments.length === 0 ? (
        <div className="no-assignments">
          <h3>📭 No assignments found</h3>
          <p>
            {assignments.length === 0
              ? "No assignments have been added yet."
              : "Try changing your filters."}
          </p>
        </div>
      ) : (
        <div className="assignment-grid">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              isCR={isCR}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;