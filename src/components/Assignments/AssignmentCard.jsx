import React from "react";
import { formatDate, getUrgencyLevel, getUrgencyLabel } from "../../utils/helpers";
import Button from "../UI/Button";

const AssignmentCard = ({ assignment, isCR, onEdit, onDelete, onToggleStatus }) => {
  const urgency = getUrgencyLevel(assignment.deadline);

  // Get file icon based on file type
  const getFileIcon = (type) => {
    if (!type) return "📄";
    if (type.includes("pdf")) return "📕";
    if (type.includes("word") || type.includes("doc")) return "📘";
    if (type.includes("sheet") || type.includes("csv") || type.includes("excel")) return "📗";
    if (type.includes("image")) return "🖼️";
    if (type.includes("presentation") || type.includes("ppt")) return "📙";
    if (type.includes("zip") || type.includes("rar")) return "🗜️";
    return "📄";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={`assignment-card urgency-${urgency}`}>
      <div className="card-header">
        <span className="card-subject">{assignment.subject}</span>
        <span className={`card-urgency urgency-badge-${urgency}`}>
          {getUrgencyLabel(assignment.deadline)}
        </span>
      </div>

      <h3 className="card-title">{assignment.title}</h3>
      <p className="card-description">{assignment.description}</p>

      {/* Attachments Section */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="card-attachments">
          <p className="attachments-title">📎 Attachments:</p>
          <ul className="attachments-list">
            {assignment.attachments.map((file, index) => (
              <li key={index} className="attachment-item">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attachment-link"
                >
                  <span className="attachment-icon">
                    {getFileIcon(file.type)}
                  </span>
                  <span className="attachment-name">{file.name}</span>
                  {file.size && (
                    <span className="attachment-size">
                      ({formatFileSize(file.size)})
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-meta">
        <span className="card-deadline">
          📅 Deadline: {formatDate(assignment.deadline)}
        </span>
        <span className="card-uploaded">
          📤 Uploaded: {formatDate(assignment.uploadedDate)}
        </span>
      </div>

      <div className="card-footer">
        <span
          className={`card-status status-${assignment.status.toLowerCase()}`}
        >
          {assignment.status === "Pending" ? "⏳ Pending" : "✅ Completed"}
        </span>

        <div className="card-actions">
          <Button
            variant={assignment.status === "Pending" ? "success" : "secondary"}
            onClick={() =>
              onToggleStatus(
                assignment.id,
                assignment.status === "Pending" ? "Completed" : "Pending"
              )
            }
          >
            {assignment.status === "Pending"
              ? "Mark Done"
              : "Mark Pending"}
          </Button>

          {isCR && (
            <>
              <Button variant="primary" onClick={() => onEdit(assignment)}>
                ✏️ Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(assignment.id, assignment.attachments)}>
                🗑️ Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;