import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

// Upload a file to Firebase Storage
export const uploadFile = async (file, assignmentId) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `assignments/${assignmentId}/${fileName}`);

    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    return {
      success: true,
      fileData: {
        name: file.name,
        url: downloadURL,
        type: file.type,
        size: file.size,
        path: `assignments/${assignmentId}/${fileName}`,
      },
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, assignmentId) => {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadFile(file, assignmentId)
    );
    const results = await Promise.all(uploadPromises);

    const successfulUploads = results
      .filter((r) => r.success)
      .map((r) => r.fileData);
    const failedUploads = results.filter((r) => !r.success);

    return {
      success: failedUploads.length === 0,
      files: successfulUploads,
      errors: failedUploads,
    };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { success: false, error: error.message };
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};