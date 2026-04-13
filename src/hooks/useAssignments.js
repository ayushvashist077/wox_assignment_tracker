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

  const handleAdd = async (assignment) => {
    const result = await addAssignment(assignment);
    if (result.success) {
      await fetchAssignments();
    }
    return result;
  };

  const handleUpdate = async (id, data) => {
    const result = await updateAssignment(id, data);
    if (result.success) {
      await fetchAssignments();
    }
    return result;
  };

  const handleDelete = async (id) => {
    const result = await deleteAssignment(id);
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