import { useState, useEffect, useCallback } from "react";
import {
  getUserProgress,
  setAssignmentProgress,
} from "../services/userProgressService";

/**
 * Loads and manages per-user personal assignment progress.
 * @param {string|null} uid  - The current user's UID (null if not logged in)
 */
export const useUserProgress = (uid) => {
  const [progressMap, setProgressMap] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    if (!uid) {
      setProgressMap({});
      return;
    }
    setLoadingProgress(true);
    getUserProgress(uid).then((result) => {
      if (result.success) setProgressMap(result.data);
      setLoadingProgress(false);
    });
  }, [uid]);

  const toggleProgress = useCallback(
    async (assignmentId) => {
      if (!uid) return;
      const current = progressMap[assignmentId] || "Pending";
      const next = current === "Pending" ? "Completed" : "Pending";

      // Optimistic update
      setProgressMap((prev) => ({ ...prev, [assignmentId]: next }));

      const result = await setAssignmentProgress(uid, assignmentId, next);
      if (!result.success) {
        // Revert on failure
        setProgressMap((prev) => ({ ...prev, [assignmentId]: current }));
      }
    },
    [uid, progressMap]
  );

  return { progressMap, loadingProgress, toggleProgress };
};