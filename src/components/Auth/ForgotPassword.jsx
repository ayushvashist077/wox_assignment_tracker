import React, { useState } from "react";
import { resetPassword, isAllowedDomain } from "../../services/authService";
import Button from "../UI/Button";

const ALLOWED_DOMAIN = "woxsen.edu.in";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!isAllowedDomain(email)) {
      setError(`Only @${ALLOWED_DOMAIN} email addresses are allowed.`);
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
    }
  };

  if (sent) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">📬</div>
          <h2>Check Your Email</h2>
          <p>
            A password reset link has been sent to <strong>{email}</strong>.
            Check your inbox and follow the instructions.
          </p>
          <div className="forgot-sent-note">
            Didn't receive it? Check your spam folder or try again in a few minutes.
          </div>
          <div style={{ marginTop: "20px" }}>
            <Button variant="primary" onClick={onBack}>
              ← Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔑</div>
        <h2>Reset Password</h2>
        <p>Enter your college email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="reset-email">College Email</label>
            <input
              type="email"
              id="reset-email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder={`e.g. ayush@${ALLOWED_DOMAIN}`}
              disabled={loading}
            />
            <span className="domain-hint">
              🏫 Only @{ALLOWED_DOMAIN} emails are accepted
            </span>
          </div>

          {error && <p className="login-error">⚠️ {error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "⏳ Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="login-switch">
          <p>
            Remember your password?
            <button
              type="button"
              className="switch-btn"
              onClick={onBack}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
