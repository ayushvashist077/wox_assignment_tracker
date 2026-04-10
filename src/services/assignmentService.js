import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { uploadMultipleFiles, deleteFile } from "./storageService";

const COLLECTION_NAME = "assignments";

// Get all assignments (sorted by deadline — upcoming first)
export const getAssignments = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("deadline", "asc")
    );
    const snapshot = await getDocs(q);
    const assignments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: assignments };
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return { success: false, error: error.message };
  }
};

// Add a new assignment (with optional file uploads)
export const addAssignment = async (assignment, files = null) => {
  try {
    // First create the assignment document
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      subject: assignment.subject,
      title: assignment.title,
      description: assignment.description,
      deadline: Timestamp.fromDate(new Date(assignment.deadline)),
      uploadedDate: Timestamp.now(),
      status: "Pending",
      attachments: [],
    });

    // If files are provided, upload them
    if (files && files.length > 0) {
      const uploadResult = await uploadMultipleFiles(files, docRef.id);
      if (uploadResult.files.length > 0) {
        await updateDoc(docRef, {
          attachments: uploadResult.files,
        });
      }
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding assignment:", error);
    return { success: false, error: error.message };
  }
};

// Update an existing assignment (with optional new file uploads)
export const updateAssignment = async (id, updatedData, newFiles = null) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const dataToUpdate = { ...updatedData };

    // If deadline is being updated, convert to Timestamp
    if (dataToUpdate.deadline && typeof dataToUpdate.deadline === "string") {
      dataToUpdate.deadline = Timestamp.fromDate(
        new Date(dataToUpdate.deadline)
      );
    }

    // If new files are provided, upload them
    if (newFiles && newFiles.length > 0) {
      const uploadResult = await uploadMultipleFiles(newFiles, id);
      if (uploadResult.files.length > 0) {
        const existingAttachments = dataToUpdate.attachments || [];
        dataToUpdate.attachments = [
          ...existingAttachments,
          ...uploadResult.files,
        ];
      }
    }

    await updateDoc(docRef, dataToUpdate);
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return { success: false, error: error.message };
  }
};

// Delete an assignment (and its files from Storage)
export const deleteAssignment = async (id, attachments = []) => {
  try {
    // Delete all attached files from Storage
    if (attachments && attachments.length > 0) {
      const deletePromises = attachments.map((file) => deleteFile(file.path));
      await Promise.all(deletePromises);
    }

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: error.message };
  }
};