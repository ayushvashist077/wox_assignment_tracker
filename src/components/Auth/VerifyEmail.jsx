import React, { useState } from "react";
import { sendVerification, logout } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";
import Button from "../UI/Button";

const VerifyEmail = () => {
  const { user, refreshStatus } = useAuthContext();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleResendEmail = async () => {
    setSending(true);
    setError("");
    setSent(false);

    const result = await sendVerification();
    setSending(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setError("");
    await refreshStatus();
    setChecking(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-icon">📧</div>
        <h2>Verify Your Email</h2>
        <p className="verify-message">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </p>

        <div className="verify-email-box">
          <div className="verify-email-icon">✉️</div>
          <div className="verify-email-details">
            <span className="verify-email-label">Verification sent to:</span>
            <span className="verify-email-address">{user?.email}</span>
          </div>
        </div>

        <div className="verify-steps">
          <div className="verify-step">
            <span className="step-number">1</span>
            <span className="step-text">Open your college email inbox</span>
          </div>
          <div className="verify-step">
            <span className="step-number">2</span>
            <span className="step-text">Find the email from <strong>noreply@...</strong></span>
          </div>
          <div className="verify-step">
            <span className="step-number">3</span>
            <span className="step-text">Click the verification link</span>
          </div>
          <div className="verify-step">
            <span className="step-number">4</span>
            <span className="step-text">Come back here and click <strong>"I've Verified"</strong></span>
          </div>
        </div>

        {sent && (
          <div className="verify-success-box">
            ✅ Verification email sent! Check your inbox.
          </div>
        )}

        {error && (
          <div className="verify-error-box">
            ⚠️ {error}
          </div>
        )}

        <div className="verify-actions">
          <Button
            variant="primary"
            onClick={handleCheckVerification}
            disabled={checking}
          >
            {checking ? "⏳ Checking..." : "✅ I've Verified"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleResendEmail}
            disabled={sending}
          >
            {sending ? "⏳ Sending..." : "📨 Resend Email"}
          </Button>

          <Button variant="danger" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </div>

        <div className="verify-tips">
          <p>💡 <strong>Can't find the email?</strong></p>
          <ul>
            <li>Check your <strong>Spam</strong> or <strong>Junk</strong> folder</li>
            <li>Make sure you registered with the correct email</li>
            <li>Wait a few minutes and try resending</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;