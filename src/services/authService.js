import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { getCREmails } from "./adminService";
import { createUserDoc, getUserStatus } from "./userService";
import { SUPER_ADMIN_EMAIL } from "../utils/constants";

const ALLOWED_DOMAIN = "woxsen.edu.in";

// Validate email domain
export const isAllowedDomain = (email) => {
  if (!email) return false;

  // Super admin bypasses domain restriction
  if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return true;

  const domain = email.split("@")[1]?.toLowerCase();
  return domain === ALLOWED_DOMAIN;
};

// Send verification email
export const sendVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      return { success: true };
    }
    return { success: false, error: "No user or already verified." };
  } catch (error) {
    let message = "Failed to send verification email.";
    if (error.code === "auth/too-many-requests") {
      message = "Too many requests. Please wait a few minutes before trying again.";
    }
    return { success: false, error: message };
  }
};

// Reload user to check if email is verified
export const reloadUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      return { success: true, emailVerified: user.emailVerified };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login with Email & Password
export const loginWithEmail = async (email, password) => {
  try {
    // Check domain before attempting login
    if (!isAllowedDomain(email)) {
      return {
        success: false,
        error: `Only @${ALLOWED_DOMAIN} email addresses are allowed.`,
      };
    }

    const result = await signInWithEmailAndPassword(auth, email, password);

    // Super admin bypasses all checks
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { success: true, user: result.user, status: "approved", emailVerified: true };
    }

    // Check if email is verified
    if (!result.user.emailVerified) {
      return { success: true, user: result.user, status: "unverified", emailVerified: false };
    }

    // Check approval status
    const statusResult = await getUserStatus(result.user.uid);
    if (statusResult.success) {
      if (statusResult.status === "rejected") {
        await signOut(auth);
        return {
          success: false,
          error: "Your account has been rejected. Contact the admin.",
        };
      }

      if (statusResult.status === "not_found") {
        await createUserDoc(result.user);
        return { success: true, user: result.user, status: "pending", emailVerified: true };
      }

      return { success: true, user: result.user, status: statusResult.status, emailVerified: true };
    }

    return { success: true, user: result.user, status: "approved", emailVerified: true };
  } catch (error) {
    let message = "Login failed. Please try again.";
    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address.";
        break;
      case "auth/invalid-credential":
        message = "Invalid email or password.";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later.";
        break;
      default:
        message = error.message;
    }
    return { success: false, error: message };
  }
};

// Register with Email & Password
export const registerWithEmail = async (name, email, password) => {
  try {
    // Check domain
    if (!isAllowedDomain(email)) {
      return {
        success: false,
        error: `Only @${ALLOWED_DOMAIN} email addresses are allowed.`,
      };
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    // Create user document with "pending" status
    await createUserDoc(result.user);

    // Send verification email
    await sendEmailVerification(result.user);

    return { success: true, user: result.user, status: "unverified" };
  } catch (error) {
    let message = "Registration failed. Please try again.";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "An account with this email already exists.";
        break;
      case "auth/weak-password":
        message = "Password must be at least 6 characters.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address.";
        break;
      default:
        message = error.message;
    }
    return { success: false, error: message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user is an authorized CR (from Firestore)
export const isCR = async (email) => {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();

  // Super admin is always a CR
  if (lowerEmail === SUPER_ADMIN_EMAIL.toLowerCase()) return true;

  try {
    const result = await getCREmails();
    if (result.success) {
      return result.emails.includes(lowerEmail);
    }
    return false;
  } catch (error) {
    console.error("Error checking CR status:", error);
    return false;
  }
};

// Check if user is a super admin
export const isSuperAdmin = (email) => {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};