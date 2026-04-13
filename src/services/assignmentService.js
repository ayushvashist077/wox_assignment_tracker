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

const COLLECTION_NAME = "assignments";

// Get all assignments (sorted by deadline — upcoming first)
export const getAssignments = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("deadline", "asc")
    );
    const snapshot = await getDocs(q);
    let assignments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Check deadlines and update status if needed
    const now = new Date();
    const updates = [];
    assignments = assignments.map((assignment) => {
      let deadlineDate = assignment.deadline?.toDate ? assignment.deadline.toDate() : new Date(assignment.deadline);
      if (assignment.status === "Pending" && deadlineDate < now) {
        // Schedule update
        updates.push(updateAssignment(assignment.id, { status: "Completed" }));
        return { ...assignment, status: "Completed" };
      }
      return assignment;
    });
    if (updates.length > 0) {
      // Fire and forget, don't block UI
      Promise.all(updates).catch(() => {});
    }
    return { success: true, data: assignments };
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return { success: false, error: error.message };
  }
};

// Add a new assignment
export const addAssignment = async (assignment) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      subject: assignment.subject,
      title: assignment.title,
      description: assignment.description,
      deadline: Timestamp.fromDate(new Date(assignment.deadline)),
      uploadedDate: Timestamp.now(),
      status: "Pending",
      links: assignment.links || [],
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding assignment:", error);
    return { success: false, error: error.message };
  }
};

// Update an existing assignment
export const updateAssignment = async (id, updatedData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const dataToUpdate = { ...updatedData };

    if (dataToUpdate.deadline && typeof dataToUpdate.deadline === "string") {
      dataToUpdate.deadline = Timestamp.fromDate(
        new Date(dataToUpdate.deadline)
      );
    }

    await updateDoc(docRef, dataToUpdate);
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return { success: false, error: error.message };
  }
};

// Delete an assignment
export const deleteAssignment = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: error.message };
  }
};