import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch all personal progress for a user.
 * Returns a plain object: { [assignmentId]: "Pending" | "Completed" }
 */
export const getUserProgress = async (uid) => {
  try {
    const snapshot = await getDocs(
      collection(db, "userProgress", uid, "assignments")
    );
    const map = {};
    snapshot.docs.forEach((d) => {
      map[d.id] = d.data().status;
    });
    return { success: true, data: map };
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return { success: false, data: {} };
  }
};

/**
 * Set personal status for one assignment.
 */
export const setAssignmentProgress = async (uid, assignmentId, status) => {
  try {
    await setDoc(
      doc(db, "userProgress", uid, "assignments", assignmentId),
      { status, updatedAt: Timestamp.now() }
    );
    return { success: true };
  } catch (error) {
    console.error("Error setting assignment progress:", error);
    return { success: false, error: error.message };
  }
};