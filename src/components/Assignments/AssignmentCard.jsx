import React from "react";
import {
  formatDate,
  getUrgencyLevel,
  getUrgencyLabel,
} from "../../utils/helpers";
import Button from "../UI/Button";

const AssignmentCard = ({
  assignment,
  isCR,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const urgency = getUrgencyLevel(assignment.deadline);

  const getLinkIcon = (url) => {
    if (!url) return "Link";
    if (url.includes("drive.google")) return "Drive";
    if (url.includes("docs.google")) return "Docs";
    if (url.includes("onedrive") || url.includes("sharepoint")) return "Cloud";
    if (url.includes("dropbox")) return "Box";
    if (url.includes(".pdf")) return "PDF";
    return "Link";
  };

  return (
    <div className={`assignment-card urgency-${urgency}`}>
      <div className="card-header">
        <span className="card-subject">{assignment.subject}</span>
        {assignment.status !== "Completed" && (
          <span className={`card-urgency urgency-badge-${urgency}`}>
            {getUrgencyLabel(assignment.deadline)}
          </span>
        )}
      </div>

      <h3 className="card-title">{assignment.title}</h3>
      <p className="card-description">{assignment.description}</p>

      {assignment.links && assignment.links.length > 0 && (
        <div className="card-attachments">
          <p className="attachments-title">Documents:</p>
          <ul className="attachments-list">
            {assignment.links.map((link, index) => (
              <li key={index} className="attachment-item">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attachment-link"
                >
                  <span className="attachment-icon">{getLinkIcon(link.url)}</span>
                  <span className="attachment-name">{link.label || link.url}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-meta">
        <span className="card-deadline">
          Deadline: {formatDate(assignment.deadline)}
        </span>
        <span className="card-uploaded">
          Uploaded: {formatDate(assignment.uploadedDate)}
        </span>
      </div>

      <div className="card-footer">
        <span
          className={`card-status status-${assignment.status.toLowerCase()}`}
        >
          {assignment.status === "Pending" ? "Pending" : "Completed"}
        </span>

        <div className="card-actions">
          {isCR && (
            <>
              <Button
                variant={
                  assignment.status === "Pending" ? "success" : "secondary"
                }
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
              <Button variant="primary" onClick={() => onEdit(assignment)}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(assignment.id, assignment.attachments)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
