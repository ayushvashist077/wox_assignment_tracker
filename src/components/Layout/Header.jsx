import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import Modal from "../UI/Modal";
import Login from "../Auth/Login";
import Button from "../UI/Button";
import LiquidButton from "../UI/LiquidButton";

const Header = () => {
  const { user, isCRUser } = useAuthContext();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">📚 Assignment Tracker</h1>
        <span className="header-subtitle">MBA Dashboard</span>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-info">
            <div className="user-avatar-placeholder">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">
                {user.displayName || user.email}
              </span>
              <span className="user-role">
                {isCRUser ? "🛡️ Class Representative" : "👨‍🎓 Student"}
              </span>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <LiquidButton size="sm" onClick={() => setShowLogin(true)}>
            🔐 Sign In
          </LiquidButton>
        )}
      </div>

      <Modal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        title={null}
      >
        <Login onClose={() => setShowLogin(false)} />
      </Modal>
    </header>
  );
};

export default Header;