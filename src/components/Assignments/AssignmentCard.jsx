import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  formatDate,
  getUrgencyLevel,
  getUrgencyLabel,
} from "../../utils/helpers";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import {
  BookOpen,
  Calculator,
  Brain,
  MessageSquare,
  BarChart2,
  FileText,
  Link2,
  ExternalLink,
} from "lucide-react";

const getSubjectMeta = (subject = "") => {
  const s = subject.toLowerCase();
  if (s.includes("law") || s.includes("ethics"))
    return { icon: <BookOpen size={18} />, color: "#f59e0b" };
  if (s.includes("product") || s.includes("experience"))
    return { icon: <BarChart2 size={18} />, color: "#3b82f6" };
  if (s.includes("generative") || s.includes("ai"))
    return { icon: <Brain size={18} />, color: "#8b5cf6" };
  if (s.includes("nlp") || s.includes("customer"))
    return { icon: <MessageSquare size={18} />, color: "#10b981" };
  if (s.includes("numerical") || s.includes("personality"))
    return { icon: <Calculator size={18} />, color: "#ec4899" };
  if (s.includes("accounting") || s.includes("financial"))
    return { icon: <FileText size={18} />, color: "#f97316" };
  return { icon: <BookOpen size={18} />, color: "#6366f1" };
};

const URGENCY_COLOR = {
  overdue: "#ef4444",
  critical: "#f97316",
  urgent: "#f59e0b",
  normal: "#22c55e",
};

const getLinkIcon = (url = "") => {
  if (url.includes("drive.google")) return "Drive";
  if (url.includes("docs.google")) return "Docs";
  if (url.includes("onedrive") || url.includes("sharepoint")) return "Cloud";
  if (url.includes("dropbox")) return "Box";
  if (url.includes(".pdf")) return "PDF";
  return "Link";
};

/**
 * Props:
 *   assignment       – the assignment object from Firestore
 *   isCR             – whether the current user is a CR (gets Edit + Delete)
 *   userStatus       – this user's personal status: "Pending" | "Completed"
 *   onToggleProgress – () => void  toggle personal status
 *   onEdit           – (assignment) => void  (CR only)
 *   onDelete         – (id, attachments) => void  (CR only)
 */
const AssignmentCard = ({
  assignment,
  isCR,
  userStatus = "Pending",
  onToggleProgress,
  onEdit,
  onDelete,
}) => {
  const urgency = getUrgencyLevel(assignment.deadline);
  const { icon, color } = getSubjectMeta(assignment.subject);
  const urgencyColor = URGENCY_COLOR[urgency];
  const [showDetail, setShowDetail] = useState(false);

  const cardRef = React.useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-120, 120], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mouseX, [-120, 120], [-8, 8]), spring);

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };
  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const personalDone = userStatus === "Completed";

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderTopColor: color,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="animated-card"
      >
        <div className="animated-card-inner">
          {/* Header */}
          <div className="ac-header">
            <div className="ac-icon-wrap" style={{ background: `${color}22`, color }}>
              {icon}
            </div>
            <div className="ac-subject-wrap">
              <span className="ac-subject">{assignment.subject}</span>
            </div>
            {!personalDone && (
              <span className="ac-urgency" style={{ color: urgencyColor }}>
                {getUrgencyLabel(assignment.deadline)}
              </span>
            )}
          </div>

          {/* Title + clamped description */}
          <div className="ac-body">
            <h3 className="ac-title">{assignment.title}</h3>
            {assignment.description && (
              <p className="ac-desc">{assignment.description}</p>
            )}
          </div>

          {/* Link chips */}
          {assignment.links && assignment.links.length > 0 && (
            <div className="ac-links">
              {assignment.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ac-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link2 size={11} />
                  <span>{link.label || getLinkIcon(link.url)}</span>
                  <ExternalLink size={10} style={{ opacity: 0.5 }} />
                </a>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="ac-meta">
            <span>📅 {formatDate(assignment.deadline)}</span>
            <span>⬆️ {formatDate(assignment.uploadedDate)}</span>
          </div>

          {/* Footer */}
          <div className="ac-footer">
            <div className="ac-footer-left">
              <span className={`ac-status-badge ac-status-${personalDone ? "completed" : "pending"}`}>
                {personalDone ? "Completed" : "Pending"}
              </span>
              <button className="ac-view-btn" onClick={() => setShowDetail(true)}>
                View
              </button>
            </div>
            <div className="ac-actions">
              {/* Personal progress toggle — every logged-in user */}
              <Button
                variant={personalDone ? "secondary" : "success"}
                size="sm"
                onClick={onToggleProgress}
              >
                {personalDone ? "↩ Mark Pending" : "Mark as Done"}
              </Button>
              {/* CR-only: Edit + Delete */}
              {isCR && (
                <>
                  <Button variant="primary" size="sm" onClick={() => onEdit(assignment)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(assignment.id, assignment.attachments)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={assignment.title}
      >
        <div className="ac-detail">
          {/* Subject badge */}
          <div className="ac-detail-subject" style={{ borderLeftColor: color }}>
            <div className="ac-icon-wrap" style={{ background: `${color}22`, color }}>
              {icon}
            </div>
            <div>
              <span className="ac-subject">{assignment.subject}</span>
              {!personalDone && (
                <span className="ac-urgency" style={{ color: urgencyColor, marginLeft: 10 }}>
                  {getUrgencyLabel(assignment.deadline)}
                </span>
              )}
            </div>
          </div>

          {/* Full description */}
          {assignment.description && (
            <div className="ac-detail-section">
              <p className="ac-detail-label">Description</p>
              <p className="ac-detail-desc">{assignment.description}</p>
            </div>
          )}

          {/* Links */}
          {assignment.links && assignment.links.length > 0 && (
            <div className="ac-detail-section">
              <p className="ac-detail-label">Documents</p>
              <div className="ac-links">
                {assignment.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ac-link"
                  >
                    <Link2 size={11} />
                    <span>{link.label || getLinkIcon(link.url)}</span>
                    <ExternalLink size={10} style={{ opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Meta table */}
          <div className="ac-detail-meta">
            <div className="ac-detail-meta-row">
              <span className="ac-detail-meta-label">Deadline</span>
              <span className="ac-detail-meta-value">{formatDate(assignment.deadline)}</span>
            </div>
            <div className="ac-detail-meta-row">
              <span className="ac-detail-meta-label">Uploaded</span>
              <span className="ac-detail-meta-value">{formatDate(assignment.uploadedDate)}</span>
            </div>
            <div className="ac-detail-meta-row">
              <span className="ac-detail-meta-label">My Status</span>
              <span className={`ac-status-badge ac-status-${personalDone ? "completed" : "pending"}`}>
                {personalDone ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Actions inside modal */}
          <div className="ac-detail-actions">
            <Button
              variant={personalDone ? "secondary" : "success"}
              onClick={() => {
                onToggleProgress();
                setShowDetail(false);
              }}
            >
              {personalDone ? "↩ Mark as Pending" : "✓ Mark as Done"}
            </Button>
            {isCR && (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    onEdit(assignment);
                    setShowDetail(false);
                  }}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(assignment.id, assignment.attachments);
                    setShowDetail(false);
                  }}
                >
                  🗑️ Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssignmentCard;