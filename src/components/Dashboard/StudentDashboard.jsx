import React from "react";
import { motion } from "framer-motion";
import { useAssignments } from "../../hooks/useAssignments";
import AssignmentList from "../Assignments/AssignmentList";
import Button from "../UI/Button";
import { exportAssignmentsPDF } from "../../utils/pdfExport";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const StudentDashboard = () => {
  const { assignments, loading, updateAssignment } = useAssignments();

  const handleToggleStatus = async (id, newStatus) => {
    await updateAssignment(id, { status: newStatus });
  };

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <h2>👨‍🎓 Student View</h2>
        <Button
          variant="outline"
          onClick={() => exportAssignmentsPDF(assignments)}
        >
          📄 Export PDF
        </Button>
      </motion.div>

      <motion.div
        className="dashboard-stats"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
      >
        <div className="stat-card">
          <span className="stat-number">{assignments.length}</span>
          <span className="stat-label">Total Assignments</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {assignments.filter((a) => a.status === "Pending").length}
          </span>
          <span className="stat-label">Due Soon</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {assignments.filter((a) => a.status === "Completed").length}
          </span>
          <span className="stat-label">Completed</span>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
        <AssignmentList
          assignments={assignments}
          loading={loading}
          isCR={false}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleStatus={handleToggleStatus}
        />
      </motion.div>
    </div>
  );
};

export default StudentDashboard;