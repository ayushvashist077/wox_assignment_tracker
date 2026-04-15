import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCREmails, addCREmail, removeCREmail, initializeAdmin } from "../../services/adminService";
import { getAllUsers, approveUser, rejectUser, deleteUserDoc } from "../../services/userService";
import { useAuthContext } from "../../context/AuthContext";
import { SUPER_ADMIN_EMAIL } from "../../utils/constants";
import Button from "../UI/Button";

const AdminPanel = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("users");
  const [crEmails, setCrEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    initializeAdmin(SUPER_ADMIN_EMAIL);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [crResult, usersResult] = await Promise.all([
      getCREmails(),
      getAllUsers(),
    ]);

    if (crResult.success) {
      setCrEmails(crResult.emails);
    }

    if (usersResult.success) {
      setUsers(usersResult.users);
    }

    setLoading(false);
  };

  const handleAddCR = async (e) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      toast.warning("Please enter an email address.");
      return;
    }

    const normalizedEmail = newEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (crEmails.includes(normalizedEmail)) {
      toast.warning("This email is already a CR.");
      return;
    }

    setAdding(true);

    const result = await addCREmail(normalizedEmail);

    if (result.success) {
      toast.success(`${normalizedEmail} added as CR.`);
      setNewEmail("");
      await fetchData();
    } else {
      toast.error("Failed to add CR.");
    }

    setAdding(false);
  };

  const handleRemoveCR = async (email) => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      toast.warning("Cannot remove the Super Admin.");
      return;
    }

    if (!window.confirm(`Remove ${email} as CR?`)) {
      return;
    }

    const result = await removeCREmail(email);

    if (result.success) {
      toast.success(`${email} removed from the CR list.`);
      await fetchData();
    } else {
      toast.error("Failed to remove CR.");
    }
  };

  const handleApprove = async (uid) => {
    const result = await approveUser(uid, user.email);

    if (result.success) {
      toast.success("User approved.");
      await fetchData();
    } else {
      toast.error(result.error || "Failed to approve user.");
    }
  };

  const handleReject = async (uid) => {
    if (!window.confirm("Reject this user? They will not be able to access assignments.")) {
      return;
    }

    const result = await rejectUser(uid);

    if (result.success) {
      toast.success("User rejected.");
      await fetchData();
    } else {
      toast.error("Failed to reject user.");
    }
  };

  const handleDeleteUser = async (uid) => {
    if (
      !window.confirm(
        "Delete this user permanently? This only removes them from Firestore, not from Firebase Auth."
      )
    ) {
      return;
    }

    const result = await deleteUserDoc(uid);

    if (result.success) {
      toast.success("User removed.");
      await fetchData();
    } else {
      toast.error("Failed to delete user.");
    }
  };

  const pendingUsers = users.filter(
    (entry) => entry.status === "pending" && entry.emailVerified === true
  );
  const unverifiedUsers = users.filter(
    (entry) => entry.status === "pending" && entry.emailVerified !== true
  );
  const approvedUsers = users.filter((entry) => entry.status === "approved");
  const rejectedUsers = users.filter((entry) => entry.status === "rejected");

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";
    }

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title-section">
          <h3>Admin Panel</h3>
          <p>Manage users and class representatives</p>
        </div>
        <div className="admin-badge">Super Admin</div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
          {pendingUsers.length > 0 && (
            <span className="tab-badge">{pendingUsers.length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === "crs" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("crs")}
        >
          CRs ({crEmails.length})
        </button>
      </div>

      {activeTab === "users" && (
        <div className="admin-tab-content">
          <div className="admin-section">
            <h4 className="section-title pending-title">
              Pending Approval - Verified ({pendingUsers.length})
            </h4>
            {loading ? (
              <div className="admin-loading">
                <p>Loading users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="admin-empty">
                <p>No pending verified requests.</p>
              </div>
            ) : (
              <ul className="admin-user-list">
                {pendingUsers.map((entry) => (
                  <li key={entry.id} className="admin-user-item pending-item">
                    <div className="user-item-left">
                      <div className="cr-avatar">
                        {(entry.name || entry.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{entry.name || "No Name"}</span>
                        <span className="user-item-email">{entry.email}</span>
                        <span className="user-item-date">
                          Registered: {formatDate(entry.registeredAt)}
                          {entry.verifiedAt && ` | Verified: ${formatDate(entry.verifiedAt)}`}
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(entry.id)}
                        title="Approve"
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(entry.id)}
                        title="Reject"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {unverifiedUsers.length > 0 && (
            <div className="admin-section">
              <h4 className="section-title unverified-title">
                Awaiting Email Verification ({unverifiedUsers.length})
              </h4>
              <div className="admin-info-box" style={{ marginBottom: "12px" }}>
                <p>
                  Users here have not verified their email yet. They will move to
                  "Pending Approval" automatically after they verify from their own inbox.
                </p>
              </div>
              <ul className="admin-user-list">
                {unverifiedUsers.map((entry) => (
                  <li key={entry.id} className="admin-user-item unverified-item">
                    <div className="user-item-left">
                      <div className="cr-avatar unverified-avatar">
                        {(entry.name || entry.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{entry.name || "No Name"}</span>
                        <span className="user-item-email">{entry.email}</span>
                        <span className="user-item-date">
                          Registered: {formatDate(entry.registeredAt)} | Email not verified
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(entry.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="admin-section">
            <h4 className="section-title approved-title">
              Approved Users ({approvedUsers.length})
            </h4>
            {approvedUsers.length === 0 ? (
              <div className="admin-empty">
                <p>No approved users yet.</p>
              </div>
            ) : (
              <ul className="admin-user-list">
                {approvedUsers.map((entry) => (
                  <li key={entry.id} className="admin-user-item approved-item">
                    <div className="user-item-left">
                      <div className="cr-avatar">
                        {(entry.name || entry.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{entry.name || "No Name"}</span>
                        <span className="user-item-email">{entry.email}</span>
                        <span className="user-item-date">
                          Approved: {formatDate(entry.approvedAt)}
                          {entry.approvedBy && ` by ${entry.approvedBy}`}
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(entry.id)}
                        title="Remove"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {rejectedUsers.length > 0 && (
            <div className="admin-section">
              <h4 className="section-title rejected-title">
                Rejected Users ({rejectedUsers.length})
              </h4>
              <ul className="admin-user-list">
                {rejectedUsers.map((entry) => (
                  <li key={entry.id} className="admin-user-item rejected-item">
                    <div className="user-item-left">
                      <div className="cr-avatar rejected-avatar">
                        {(entry.name || entry.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{entry.name || "No Name"}</span>
                        <span className="user-item-email">{entry.email}</span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(entry.id)}
                        title="Approve"
                      >
                        Approve
                      </button>
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(entry.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === "crs" && (
        <div className="admin-tab-content">
          <form className="admin-add-form" onSubmit={handleAddCR}>
            <div className="admin-input-group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter CR's college email..."
                disabled={adding}
                className="admin-input"
              />
              <Button type="submit" variant="success" disabled={adding}>
                {adding ? "Adding..." : "Add CR"}
              </Button>
            </div>
          </form>

          <div className="admin-list-section">
            <div className="admin-list-header">
              <h4>Current CRs ({crEmails.length})</h4>
              <button className="admin-refresh-btn" onClick={fetchData} title="Refresh">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="admin-loading">
                <p>Loading CR list...</p>
              </div>
            ) : crEmails.length === 0 ? (
              <div className="admin-empty">
                <p>No CRs added yet. Add one above.</p>
              </div>
            ) : (
              <ul className="admin-cr-list">
                {crEmails.map((email, index) => (
                  <li key={index} className="admin-cr-item">
                    <div className="cr-item-left">
                      <div className="cr-avatar">{email.charAt(0).toUpperCase()}</div>
                      <div className="cr-info">
                        <span className="cr-email">{email}</span>
                        {email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? (
                          <span className="cr-tag super-admin-tag">Super Admin</span>
                        ) : (
                          <span className="cr-tag cr-tag-normal">Class Rep</span>
                        )}
                      </div>
                    </div>
                    <div className="cr-item-right">
                      {email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() ? (
                        <button
                          className="cr-remove-btn"
                          onClick={() => handleRemoveCR(email)}
                          title="Remove CR"
                        >
                          X
                        </button>
                      ) : (
                        <span className="cr-protected">Locked</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-info-box">
            <p>
              How it works: only emails listed above can add, edit, or delete assignments.
              They still need to register and be approved before they can access the CR dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
