import React from "react";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isCRUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!isCRUser) {
    return (
      <div className="access-denied">
        <h2>🔒 Access Denied</h2>
        <p>Only authorized Class Representatives can access this section.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;