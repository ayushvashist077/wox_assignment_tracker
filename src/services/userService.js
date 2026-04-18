import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";

// Create a user document after registration (status: pending)
export const createUserDoc = async (user) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);

    // Don't overwrite if already exists
    if (userSnap.exists()) {
      return { success: true, status: userSnap.data().status };
    }

    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email.toLowerCase(),
      status: "pending",
      emailVerified: false,
      registeredAt: new Date(),
      verifiedAt: null,
      approvedAt: null,
      approvedBy: null,
    });

    return { success: true, status: "pending" };
  } catch (error) {
    console.error("Error creating user doc:", error);
    return { success: false, error: error.message };
  }
};

// Update email verified status in Firestore
export const updateEmailVerifiedStatus = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    // Only update if not already verified
    if (userSnap.exists() && !userSnap.data().emailVerified) {
      await updateDoc(userRef, {
        emailVerified: true,
        verifiedAt: Timestamp.now(),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating email verified status:", error);
    return { success: false, error: error.message };
  }
};

// Get a user's approval status
export const getUserStatus = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, status: userSnap.data().status };
    }
    return { success: true, status: "not_found" };
  } catch (error) {
    console.error("Error getting user status:", error);
    return { success: false, error: error.message };
  }
};

// Get all users (for admin panel)
export const getAllUsers = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy("registeredAt", "desc")
    );
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }
};

// Sync email verification status from Firebase Auth for all pending users
export const syncVerificationStatus = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const snapshot = await getDocs(q);

    const pendingUnverified = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.status === "pending" && !data.emailVerified;
    });

    // For each unverified pending user, check via API
    // Since we can't check Firebase Auth from client directly for other users,
    // we'll use a different approach — store a verification token check endpoint
    // For now, return the list so admin panel can handle it
    return {
      success: true,
      pendingUnverifiedCount: pendingUnverified.length,
    };
  } catch (error) {
    console.error("Error syncing verification:", error);
    return { success: false, error: error.message };
  }
};

// Approve a user
export const approveUser = async (uid, adminEmail) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User record not found." };
    }

    if (!userSnap.data().emailVerified) {
      return {
        success: false,
        error: "User must verify their email before approval.",
      };
    }

    await updateDoc(userRef, {
      status: "approved",
      approvedAt: new Date(),
      approvedBy: adminEmail,
    });
    return { success: true };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, error: error.message };
  }
};

// Reject a user
export const rejectUser = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      status: "rejected",
    });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting user:", error);
    return { success: false, error: error.message };
  }
};

// Delete a user document
export const deleteUserDoc = async (uid) => {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, uid));
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
};
