import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { isCR, isSuperAdmin } from "../services/authService";
import { getUserStatus, updateEmailVerifiedStatus } from "../services/userService";
import { SUPER_ADMIN_EMAIL } from "../utils/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCRUser, setIsCRUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Super admin bypasses everything
        if (currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          setEmailVerified(true);
          setApprovalStatus("approved");
          setIsCRUser(true);
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check email verification
        setEmailVerified(currentUser.emailVerified);

        if (!currentUser.emailVerified) {
          setApprovalStatus("unverified");
          setIsCRUser(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Email is verified — sync to Firestore
        await updateEmailVerifiedStatus(currentUser.uid);

        // Check approval status
        const statusResult = await getUserStatus(currentUser.uid);
        if (statusResult.success) {
          setApprovalStatus(
            statusResult.status === "not_found" ? "pending" : statusResult.status
          );
        } else {
          setApprovalStatus("pending");
        }

        // Only check CR if approved
        if (statusResult.success && statusResult.status === "approved") {
          const crStatus = await isCR(currentUser.email);
          setIsCRUser(crStatus);
        } else {
          setIsCRUser(false);
        }

        setIsAdmin(isSuperAdmin(currentUser.email));
      } else {
        setIsCRUser(false);
        setIsAdmin(false);
        setApprovalStatus(null);
        setEmailVerified(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh status
  const refreshStatus = async () => {
    if (!auth.currentUser) return;

    setLoading(true);

    try {
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;
      setUser({ ...refreshedUser });

      // Super admin bypass
      if (refreshedUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setEmailVerified(true);
        setApprovalStatus("approved");
        setIsCRUser(true);
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      setEmailVerified(refreshedUser.emailVerified);

      if (!refreshedUser.emailVerified) {
        setApprovalStatus("unverified");
        setLoading(false);
        return;
      }

      // Email verified — sync to Firestore
      await updateEmailVerifiedStatus(refreshedUser.uid);

      // Check approval
      const statusResult = await getUserStatus(refreshedUser.uid);
      if (statusResult.success) {
        const status = statusResult.status === "not_found" ? "pending" : statusResult.status;
        setApprovalStatus(status);

        if (status === "approved") {
          const crStatus = await isCR(refreshedUser.email);
          setIsCRUser(crStatus);
        }
      } else {
        setApprovalStatus("pending");
      }
    } catch (error) {
      console.error("Error refreshing status:", error);
    }

    setLoading(false);
  };

  const value = {
    user,
    loading,
    isCRUser,
    isAdmin,
    approvalStatus,
    emailVerified,
    refreshStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};