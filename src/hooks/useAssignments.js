import { useState, useEffect, useCallback } from "react";
import {
  getAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    const result = await getAssignments();
    if (result.success) {
      setAssignments(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAdd = async (assignment, files = null) => {
    const result = await addAssignment(assignment, files);
    if (result.success) {
      await fetchAssignments();
    }
    return result;
  };

  const handleUpdate = async (id, data, newFiles = null) => {
    const result = await updateAssignment(id, data, newFiles);
    if (result.success) {
      await fetchAssignments();
    }
    return result;
  };

  const handleDelete = async (id, attachments = []) => {
    const result = await deleteAssignment(id, attachments);
    if (result.success) {
      await fetchAssignments();
    }
    return result;
  };

  return {
    assignments,
    loading,
    error,
    refresh: fetchAssignments,
    addAssignment: handleAdd,
    updateAssignment: handleUpdate,
    deleteAssignment: handleDelete,
  };
};