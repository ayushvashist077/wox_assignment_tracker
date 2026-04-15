// Format Firestore timestamp to readable date
export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Format date for input[type="date"]
export const formatDateForInput = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toISOString().split("T")[0];
};

// Get urgency level based on deadline
export const getUrgencyLevel = (deadline) => {
  if (!deadline) return "normal";
  const now = new Date();
  const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 1) return "critical";
  if (diffDays <= 3) return "urgent";
  return "normal";
};

export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;

  const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfDeadline = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate()
  );

  return Math.round((startOfDeadline - startOfToday) / (1000 * 60 * 60 * 24));
};

// Get urgency label
export const getUrgencyLabel = (deadline) => {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);

  if (daysUntilDeadline === null) {
    return "No deadline";
  }

  if (daysUntilDeadline < 0) {
    const daysOverdue = Math.abs(daysUntilDeadline);
    return `Overdue by ${daysOverdue} day${daysOverdue === 1 ? "" : "s"}`;
  }

  if (daysUntilDeadline === 0) {
    return "Due today";
  }

  return `Due in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? "" : "s"}`;
};

// Sort assignments
export const sortAssignments = (assignments, sortBy) => {
  const sorted = [...assignments];
  switch (sortBy) {
    case "deadline-asc":
      return sorted.sort((a, b) => {
        const dateA = a.deadline?.toDate ? a.deadline.toDate() : new Date(a.deadline);
        const dateB = b.deadline?.toDate ? b.deadline.toDate() : new Date(b.deadline);
        return dateA - dateB;
      });
    case "deadline-desc":
      return sorted.sort((a, b) => {
        const dateA = a.deadline?.toDate ? a.deadline.toDate() : new Date(a.deadline);
        const dateB = b.deadline?.toDate ? b.deadline.toDate() : new Date(b.deadline);
        return dateB - dateA;
      });
    case "uploaded-desc":
      return sorted.sort((a, b) => {
        const dateA = a.uploadedDate?.toDate
          ? a.uploadedDate.toDate()
          : new Date(a.uploadedDate);
        const dateB = b.uploadedDate?.toDate
          ? b.uploadedDate.toDate()
          : new Date(b.uploadedDate);
        return dateB - dateA;
      });
    case "subject-asc":
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject));
    default:
      return sorted;
  }
};

// Filter assignments
export const filterAssignments = (assignments, filters) => {
  return assignments.filter((a) => {
    const subjectMatch =
      !filters.subject || filters.subject === "All"
        ? true
        : a.subject === filters.subject;
    const statusMatch =
      !filters.status || filters.status === "All"
        ? true
        : a.status === filters.status;
    return subjectMatch && statusMatch;
  });
};
