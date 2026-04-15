import React, { useState } from "react";
import { loginWithEmail, registerWithEmail, isAllowedDomain } from "../../services/authService";
import Button from "../UI/Button";
import ForgotPassword from "./ForgotPassword";

const ALLOWED_DOMAIN = "woxsen.edu.in";

const Login = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isAllowedDomain(formData.email)) {
      setError(`Only @${ALLOWED_DOMAIN} email addresses are allowed.`);
      return;
    }

    setLoading(true);
    const result = await loginWithEmail(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      if (onClose) {
        onClose();
      }
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isAllowedDomain(formData.email)) {
      setError(`Only @${ALLOWED_DOMAIN} email addresses are allowed.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await registerWithEmail(
      formData.name,
      formData.email,
      formData.password
    );
    setLoading(false);

    if (result.success) {
      setRegistered(true);
    } else {
      setError(result.error);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setRegistered(false);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  if (registered) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">OK</div>
          <h2>Registration Successful!</h2>
          <p>
            Your account has been created. Verify your email first, then wait
            for the admin to approve your access.
          </p>

          <div className="registered-info-box">
            <div className="registered-row">
              <span className="registered-label">Name:</span>
              <span className="registered-value">{formData.name}</span>
            </div>
            <div className="registered-row">
              <span className="registered-label">Email:</span>
              <span className="registered-value">{formData.email}</span>
            </div>
            <div className="registered-row">
              <span className="registered-label">Status:</span>
              <span className="registered-status">Email Verification Required</span>
            </div>
          </div>

          <div className="registered-actions">
            <Button
              variant="primary"
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            >
              Got it
            </Button>
          </div>

          <p className="login-note">
            After email verification, your request will move to admin approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">{isRegister ? "New" : "Sign In"}</div>
        <h2>{isRegister ? "Create Account" : "Sign In"}</h2>
        <p>
          {isRegister
            ? "Register with your Woxsen email"
            : "Sign in with your Woxsen email"}
        </p>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="login-form">
          {isRegister && (
            <div className="login-field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ayush Vashist"
                disabled={loading}
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email">College Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={`e.g. ayush@${ALLOWED_DOMAIN}`}
              disabled={loading}
            />
            <span className="domain-hint">
              Only @{ALLOWED_DOMAIN} emails are accepted
            </span>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
            {!isRegister && (
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => setShowForgotPassword(true)}
                disabled={loading}
              >
                Forgot password?
              </button>
            )}
          </div>

          {isRegister && (
            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={loading}
              />
            </div>
          )}

          {error && <p className="login-error">Error: {error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="login-switch">
          <p>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={toggleMode}
              disabled={loading}
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>

        <p className="login-note">Only approved users can access assignments.</p>
      </div>
    </div>
  );
};

export default Login;
