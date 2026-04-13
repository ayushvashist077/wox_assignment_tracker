import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAssignments } from "../../hooks/useAssignments";
import { useAuthContext } from "../../context/AuthContext";
import AssignmentForm from "../Assignments/AssignmentForm";
import AssignmentList from "../Assignments/AssignmentList";
import AdminPanel from "../Admin/AdminPanel";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { exportAssignmentsPDF } from "../../utils/pdfExport";
import { toast } from "react-toastify";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CRDashboard = () => {
  const {
    assignments,
    loading,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();
  const { isAdmin } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAdd = async (formData, files) => {
    const result = await addAssignment(formData, files);
    if (result.success) {
      setShowForm(false);
    } else {
      toast.error("❌ Failed to add assignment.");
    }
  };

  const handleUpdate = async (formData, newFiles) => {
    const existingAttachments = editingAssignment.attachments || [];
    const dataToUpdate = {
      ...formData,
      attachments: existingAttachments,
    };
    const result = await updateAssignment(editingAssignment.id, dataToUpdate, newFiles);
    if (result.success) {
      setEditingAssignment(null);
    } else {
      toast.error("❌ Failed to update assignment.");
    }
  };

  const handleDelete = async (id, attachments) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const result = await deleteAssignment(id, attachments);
      if (result.success) {
        toast.success("🗑️ Assignment deleted.");
      } else {
        toast.error("❌ Failed to delete assignment.");
      }
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    await updateAssignment(id, { status: newStatus });
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
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
        <h2>🛡️ CR Dashboard</h2>
        <div className="dashboard-actions">
          {isAdmin && (
            <Button
              variant={showAdmin ? "secondary" : "outline"}
              onClick={() => setShowAdmin(!showAdmin)}
            >
              {showAdmin ? "✕ Close Admin" : "⚙️ Admin Panel"}
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowForm(true)}>
            ➕ Add Assignment
          </Button>
          <Button
            variant="outline"
            onClick={() => exportAssignmentsPDF(assignments)}
          >
            📄 Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Admin Panel (only visible to super admin) */}
      {isAdmin && showAdmin && <AdminPanel />}

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
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Assignment"
      >
        <AssignmentForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal
        isOpen={editingAssignment !== null}
        onClose={() => setEditingAssignment(null)}
        title="Edit Assignment"
      >
        <AssignmentForm
          onSubmit={handleUpdate}
          initialData={editingAssignment}
          onCancel={() => setEditingAssignment(null)}
        />
      </Modal>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
        <AssignmentList
          assignments={assignments}
          loading={loading}
          isCR={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </motion.div>
    </div>
  );
};

export default CRDashboard;