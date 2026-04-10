import React, { useState } from "react";
import { logout } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";
import Button from "../UI/Button";

const PendingApproval = () => {
  const { user, refreshStatus, approvalStatus } = useAuthContext();
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    await refreshStatus();
    setChecking(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="pending-container">
      <div className="pending-card">
        {approvalStatus === "rejected" ? (
          <>
            <div className="pending-icon rejected-icon">🚫</div>
            <h2>Account Rejected</h2>
            <p className="pending-message">
              Your account has been rejected by the admin. If you think this is
              a mistake, please contact the Class Representative.
            </p>
            <div className="pending-user-info">
              <span className="pending-email">{user?.email}</span>
            </div>
            <div className="pending-actions">
              <Button variant="danger" onClick={handleLogout}>
                🚪 Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="pending-icon">⏳</div>
            <h2>Waiting for Approval</h2>
            <p className="pending-message">
              Your email has been verified! Please wait for the
              admin to approve your access. You'll be able to view assignments
              once approved.
            </p>
            <div className="pending-user-info">
              <div className="pending-avatar">
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="pending-details">
                <span className="pending-name">
                  {user?.displayName || "Student"}
                </span>
                <span className="pending-email">{user?.email}</span>
              </div>
            </div>

            <div className="pending-status-box">
              <div className="status-dot pending-dot"></div>
              <span>Approval Pending</span>
            </div>

            <div className="pending-actions">
              <Button
                variant="primary"
                onClick={handleCheckStatus}
                disabled={checking}
              >
                {checking ? "⏳ Checking..." : "🔄 Check Status"}
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                🚪 Logout
              </Button>
            </div>

            <div className="pending-tips">
              <p>💡 <strong>Tip:</strong> Contact your CR to speed up the approval process.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingApproval;