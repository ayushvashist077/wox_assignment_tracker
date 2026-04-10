import React from "react";
import { useAssignments } from "../../hooks/useAssignments";
import AssignmentList from "../Assignments/AssignmentList";
import Button from "../UI/Button";
import { exportAssignmentsPDF } from "../../utils/pdfExport";

const StudentDashboard = () => {
  const { assignments, loading, updateAssignment } = useAssignments();

  const handleToggleStatus = async (id, newStatus) => {
    // Students can mark as completed locally (optional feature)
    await updateAssignment(id, { status: newStatus });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>👨‍🎓 Student View</h2>
        <Button
          variant="outline"
          onClick={() => exportAssignmentsPDF(assignments)}
        >
          📄 Export PDF
        </Button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{assignments.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {assignments.filter((a) => a.status === "Pending").length}
          </span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {assignments.filter((a) => a.status === "Completed").length}
          </span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <AssignmentList
        assignments={assignments}
        loading={loading}
        isCR={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default StudentDashboard;