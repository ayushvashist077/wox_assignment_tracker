import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";

const ADMIN_DOC = "config/authorized_users";

// Get all authorized CR emails from Firestore
export const getCREmails = async () => {
  try {
    const docRef = doc(db, ADMIN_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, emails: docSnap.data().crEmails || [] };
    } else {
      // Create the document if it doesn't exist
      await setDoc(docRef, { crEmails: [], superAdmin: [] });
      return { success: true, emails: [] };
    }
  } catch (error) {
    console.error("Error fetching CR emails:", error);
    return { success: false, error: error.message };
  }
};

// Get super admin emails from Firestore
export const getSuperAdmins = async () => {
  try {
    const docRef = doc(db, ADMIN_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, emails: docSnap.data().superAdmin || [] };
    } else {
      await setDoc(docRef, { crEmails: [], superAdmin: [] });
      return { success: true, emails: [] };
    }
  } catch (error) {
    console.error("Error fetching super admins:", error);
    return { success: false, error: error.message };
  }
};

// Add a CR email
export const addCREmail = async (email) => {
  try {
    const docRef = doc(db, ADMIN_DOC);
    await updateDoc(docRef, {
      crEmails: arrayUnion(email.toLowerCase().trim()),
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding CR email:", error);
    return { success: false, error: error.message };
  }
};

// Remove a CR email
export const removeCREmail = async (email) => {
  try {
    const docRef = doc(db, ADMIN_DOC);
    await updateDoc(docRef, {
      crEmails: arrayRemove(email.toLowerCase().trim()),
    });
    return { success: true };
  } catch (error) {
    console.error("Error removing CR email:", error);
    return { success: false, error: error.message };
  }
};

// Initialize admin config (run once to set up your super admin email)
export const initializeAdmin = async (superAdminEmail) => {
  try {
    const docRef = doc(db, ADMIN_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        crEmails: [superAdminEmail.toLowerCase().trim()],
        superAdmin: [superAdminEmail.toLowerCase().trim()],
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error initializing admin:", error);
    return { success: false, error: error.message };
  }
};