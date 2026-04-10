import React, { useState, useEffect } from "react";
import { getCREmails, addCREmail, removeCREmail, initializeAdmin } from "../../services/adminService";
import { getAllUsers, approveUser, rejectUser, deleteUserDoc, markUserVerified } from "../../services/userService";
import { useAuthContext } from "../../context/AuthContext";
import { SUPER_ADMIN_EMAIL } from "../../utils/constants";
import Button from "../UI/Button";
import { toast } from "react-toastify";

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

    if (crResult.success) setCrEmails(crResult.emails);
    if (usersResult.success) setUsers(usersResult.users);
    setLoading(false);
  };

  // CR Management
  const handleAddCR = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.warning("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (crEmails.includes(newEmail.toLowerCase().trim())) {
      toast.warning("This email is already a CR.");
      return;
    }

    setAdding(true);
    const result = await addCREmail(newEmail);
    if (result.success) {
      toast.success(`✅ ${newEmail} added as CR!`);
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

    if (window.confirm(`Remove ${email} as CR?`)) {
      const result = await removeCREmail(email);
      if (result.success) {
        toast.success(`🗑️ ${email} removed from CR list.`);
        await fetchData();
      } else {
        toast.error("Failed to remove CR.");
      }
    }
  };

  // User Management
  const handleApprove = async (uid) => {
    const result = await approveUser(uid, user.email);
    if (result.success) {
      toast.success("✅ User approved!");
      await fetchData();
    } else {
      toast.error("Failed to approve user.");
    }
  };

  const handleReject = async (uid) => {
    if (window.confirm("Reject this user? They won't be able to access assignments.")) {
      const result = await rejectUser(uid);
      if (result.success) {
        toast.success("🚫 User rejected.");
        await fetchData();
      } else {
        toast.error("Failed to reject user.");
      }
    }
  };

  const handleDeleteUser = async (uid) => {
    if (window.confirm("Delete this user permanently? This only removes them from the approved list, not their Firebase Auth account.")) {
      const result = await deleteUserDoc(uid);
      if (result.success) {
        toast.success("🗑️ User removed.");
        await fetchData();
      } else {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleMarkVerified = async (uid, email) => {
    if (window.confirm(`Manually mark ${email} as email verified? Only do this if you've confirmed their identity.`)) {
      const result = await markUserVerified(uid);
      if (result.success) {
        toast.success(`✅ ${email} marked as verified!`);
        await fetchData();
      } else {
        toast.error("Failed to mark as verified.");
      }
    }
  };

  // Filter users
  const pendingUsers = users.filter((u) => u.status === "pending" && u.emailVerified === true);
  const unverifiedUsers = users.filter((u) => u.status === "pending" && u.emailVerified !== true);
  const approvedUsers = users.filter((u) => u.status === "approved");
  const rejectedUsers = users.filter((u) => u.status === "rejected");

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
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
          <h3>⚙️ Admin Panel</h3>
          <p>Manage Users & Class Representatives</p>
        </div>
        <div className="admin-badge">🔑 Super Admin</div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
          {pendingUsers.length > 0 && (
            <span className="tab-badge">{pendingUsers.length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === "crs" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("crs")}
        >
          🛡️ CRs ({crEmails.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="admin-tab-content">
          {/* Pending Verified Users */}
          <div className="admin-section">
            <h4 className="section-title pending-title">
              ⏳ Pending Approval — Verified ({pendingUsers.length})
            </h4>
            {loading ? (
              <div className="admin-loading"><p>Loading users...</p></div>
            ) : pendingUsers.length === 0 ? (
              <div className="admin-empty"><p>✅ No pending verified requests!</p></div>
            ) : (
              <ul className="admin-user-list">
                {pendingUsers.map((u) => (
                  <li key={u.id} className="admin-user-item pending-item">
                    <div className="user-item-left">
                      <div className="cr-avatar">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{u.name || "No Name"}</span>
                        <span className="user-item-email">{u.email}</span>
                        <span className="user-item-date">
                          Registered: {formatDate(u.registeredAt)}
                          {u.verifiedAt && ` • Verified: ${formatDate(u.verifiedAt)}`}
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button className="approve-btn" onClick={() => handleApprove(u.id)} title="Approve">
                        ✅ Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleReject(u.id)} title="Reject">
                        ❌ Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Unverified Users */}
          {unverifiedUsers.length > 0 && (
            <div className="admin-section">
              <h4 className="section-title unverified-title">
                📧 Awaiting Email Verification ({unverifiedUsers.length})
              </h4>
              <div className="admin-info-box" style={{ marginBottom: "12px" }}>
                <p>💡 Users here haven't verified their email yet. They'll automatically move to 
                "Pending Approval" once they verify. You can also manually verify if needed.</p>
              </div>
              <ul className="admin-user-list">
                {unverifiedUsers.map((u) => (
                  <li key={u.id} className="admin-user-item unverified-item">
                    <div className="user-item-left">
                      <div className="cr-avatar unverified-avatar">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{u.name || "No Name"}</span>
                        <span className="user-item-email">{u.email}</span>
                        <span className="user-item-date">
                          Registered: {formatDate(u.registeredAt)} • <em>Email not verified</em>
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button
                        className="verify-manually-btn"
                        onClick={() => handleMarkVerified(u.id, u.email)}
                        title="Manually mark as verified"
                      >
                        ✅ Verify
                      </button>
                      <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Approved Users */}
          <div className="admin-section">
            <h4 className="section-title approved-title">
              ✅ Approved Users ({approvedUsers.length})
            </h4>
            {approvedUsers.length === 0 ? (
              <div className="admin-empty"><p>No approved users yet.</p></div>
            ) : (
              <ul className="admin-user-list">
                {approvedUsers.map((u) => (
                  <li key={u.id} className="admin-user-item approved-item">
                    <div className="user-item-left">
                      <div className="cr-avatar">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{u.name || "No Name"}</span>
                        <span className="user-item-email">{u.email}</span>
                        <span className="user-item-date">
                          Approved: {formatDate(u.approvedAt)}
                          {u.approvedBy && ` by ${u.approvedBy}`}
                        </span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id)} title="Remove">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rejected Users */}
          {rejectedUsers.length > 0 && (
            <div className="admin-section">
              <h4 className="section-title rejected-title">
                🚫 Rejected Users ({rejectedUsers.length})
              </h4>
              <ul className="admin-user-list">
                {rejectedUsers.map((u) => (
                  <li key={u.id} className="admin-user-item rejected-item">
                    <div className="user-item-left">
                      <div className="cr-avatar rejected-avatar">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-item-info">
                        <span className="user-item-name">{u.name || "No Name"}</span>
                        <span className="user-item-email">{u.email}</span>
                      </div>
                    </div>
                    <div className="user-item-actions">
                      <button className="approve-btn" onClick={() => handleApprove(u.id)} title="Approve">
                        ✅
                      </button>
                      <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CRs Tab */}
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
                {adding ? "⏳ Adding..." : "➕ Add CR"}
              </Button>
            </div>
          </form>

          <div className="admin-list-section">
            <div className="admin-list-header">
              <h4>📋 Current CRs ({crEmails.length})</h4>
              <button className="admin-refresh-btn" onClick={fetchData} title="Refresh">
                🔄
              </button>
            </div>

            {loading ? (
              <div className="admin-loading"><p>Loading CR list...</p></div>
            ) : crEmails.length === 0 ? (
              <div className="admin-empty"><p>📭 No CRs added yet. Add one above!</p></div>
            ) : (
              <ul className="admin-cr-list">
                {crEmails.map((email, index) => (
                  <li key={index} className="admin-cr-item">
                    <div className="cr-item-left">
                      <div className="cr-avatar">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div className="cr-info">
                        <span className="cr-email">{email}</span>
                        {email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && (
                          <span className="cr-tag super-admin-tag">Super Admin</span>
                        )}
                        {email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() && (
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
                          ✕
                        </button>
                      ) : (
                        <span className="cr-protected">🔒</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-info-box">
            <p>💡 <strong>How it works:</strong> Only emails listed above can add, edit, or delete assignments.
            They must also be registered and approved to access the CR dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;