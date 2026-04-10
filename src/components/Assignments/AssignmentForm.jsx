import React, { useState, useEffect } from "react";
import { SUBJECTS } from "../../utils/constants";
import { formatDateForInput } from "../../utils/helpers";
import Button from "../UI/Button";

const AssignmentForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject || "",
        title: initialData.title || "",
        description: initialData.description || "",
        deadline: formatDateForInput(initialData.deadline) || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleRemoveFiles = () => {
    setFiles(null);
    // Reset the file input
    const fileInput = document.getElementById("attachments");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.subject ||
      !formData.title ||
      !formData.description ||
      !formData.deadline
    ) {
      alert("Please fill in all fields!");
      return;
    }

    setUploading(true);

    if (initialData) {
      // Editing — pass existing attachments + new files
      await onSubmit(formData, files);
    } else {
      // Adding new
      await onSubmit(formData, files);
    }

    setUploading(false);

    if (!initialData) {
      setFormData({ subject: "", title: "", description: "", deadline: "" });
      setFiles(null);
      const fileInput = document.getElementById("attachments");
      if (fileInput) fileInput.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
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
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="attachments">
          📎 Attach Files{" "}
          <span className="file-hint">(PDF, DOC, CSV, images, etc.)</span>
        </label>
        <input
          type="file"
          id="attachments"
          name="attachments"
          onChange={handleFileChange}
          multiple
          className="file-input"
        />
        {files && files.length > 0 && (
          <div className="selected-files">
            <p className="selected-files-title">
              📁 {files.length} file(s) selected:
            </p>
            <ul className="file-list">
              {Array.from(files).map((file, index) => (
                <li key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({formatFileSize(file.size)})
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="remove-files-btn"
              onClick={handleRemoveFiles}
            >
              ✕ Remove all files
            </button>
          </div>
        )}

        {/* Show existing attachments when editing */}
        {initialData && initialData.attachments && initialData.attachments.length > 0 && (
          <div className="existing-files">
            <p className="existing-files-title">📌 Current attachments:</p>
            <ul className="file-list">
              {initialData.attachments.map((file, index) => (
                <li key={index} className="file-item">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button type="submit" variant="success" disabled={uploading}>
          {uploading
            ? "⏳ Uploading..."
            : initialData
            ? "Update Assignment"
            : "Add Assignment"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={uploading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AssignmentForm;