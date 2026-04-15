import React, { useState, useEffect } from "react";
import { SUBJECTS } from "../../utils/constants";
import { formatDateForInput } from "../../utils/helpers";
import Button from "../UI/Button";

const getLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AssignmentForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [links, setLinks] = useState([{ label: "", url: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const todayDate = getLocalDateInputValue();
  const existingDeadline = initialData?.deadline
    ? formatDateForInput(initialData.deadline)
    : "";
  const minDeadline = existingDeadline && existingDeadline < todayDate
    ? existingDeadline
    : todayDate;

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject || "",
        title: initialData.title || "",
        description: initialData.description || "",
        deadline: formatDateForInput(initialData.deadline) || "",
      });
      if (initialData.links && initialData.links.length > 0) {
        setLinks(initialData.links.map((l) => ({ label: l.label || "", url: l.url || "" })));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, field, value) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "" }]);

  const removeLink = (index) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.title || !formData.description || !formData.deadline) {
      alert("Please fill in all fields!");
      return;
    }

    if (formData.deadline < todayDate && formData.deadline !== existingDeadline) {
      alert("Deadline cannot be in the past.");
      return;
    }

    setSubmitting(true);

    const validLinks = links.filter((l) => l.url.trim() !== "");
    await onSubmit({ ...formData, links: validLinks });

    setSubmitting(false);

    if (!initialData) {
      setFormData({ subject: "", title: "", description: "", deadline: "" });
      setLinks([{ label: "", url: "" }]);
    }
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Subject --</option>
          {SUBJECTS.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="title">Assignment Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Case Study Analysis"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the assignment..."
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          min={minDeadline}
          required
        />
      </div>

      <div className="form-group">
        <label>🔗 Document Links <span className="file-hint">(Google Drive, OneDrive, etc.)</span></label>
        {links.map((link, index) => (
          <div key={index} className="link-row">
            <input
              type="text"
              placeholder="Label (e.g. Question Paper)"
              value={link.label}
              onChange={(e) => handleLinkChange(index, "label", e.target.value)}
              className="link-label-input"
            />
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="link-url-input"
            />
            {links.length > 1 && (
              <button type="button" className="remove-link-btn" onClick={() => removeLink(index)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="add-link-btn" onClick={addLink}>
          + Add another link
        </button>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="success" disabled={submitting}>
          {submitting ? "⏳ Saving..." : initialData ? "Update Assignment" : "Add Assignment"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AssignmentForm;
