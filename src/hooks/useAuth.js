import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { isCR, isSuperAdmin } from "../services/authService";
import { getUserStatus } from "../services/userService";
import { SUPER_ADMIN_EMAIL } from "../utils/constants";

export const useAuth = () => {
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

        // If not verified, skip other checks
        if (!currentUser.emailVerified) {
          setApprovalStatus("unverified");
          setIsCRUser(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check approval status from Firestore
        const statusResult = await getUserStatus(currentUser.uid);
        if (statusResult.success) {
          setApprovalStatus(
            statusResult.status === "not_found" ? "pending" : statusResult.status
          );
        } else {
          setApprovalStatus("pending");
        }

        // Only check CR status if approved
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

  // Refresh status (after verifying email or checking approval)
  const refreshStatus = async () => {
    if (user) {
      // Reload user to get latest emailVerified status
      await user.reload();
      const refreshedUser = auth.currentUser;
      setUser(refreshedUser);

      if (refreshedUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setEmailVerified(true);
        setApprovalStatus("approved");
        return;
      }

      setEmailVerified(refreshedUser.emailVerified);

      if (!refreshedUser.emailVerified) {
        setApprovalStatus("unverified");
        return;
      }

      const statusResult = await getUserStatus(refreshedUser.uid);
      if (statusResult.success) {
        setApprovalStatus(
          statusResult.status === "not_found" ? "pending" : statusResult.status
        );

        if (statusResult.status === "approved") {
          const crStatus = await isCR(refreshedUser.email);
          setIsCRUser(crStatus);
        }
      }
    }
  };

  return { user, loading, isCRUser, isAdmin, approvalStatus, emailVerified, refreshStatus };
};