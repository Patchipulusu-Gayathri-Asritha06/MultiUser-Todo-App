import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiSave, FiTag } from "react-icons/fi";

const INITIAL_FORM = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
  tags: [],
};

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || "",
        description: editTask.description || "",
        status: editTask.status || "Pending",
        priority: editTask.priority || "Medium",
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split("T")[0]
          : "",
        tags: editTask.tags || [],
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
    setTagInput("");
  }, [editTask, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";
    else if (form.title.trim().length > 100) newErrors.title = "Title cannot exceed 100 characters";
    if (form.description.length > 500) newErrors.description = "Description cannot exceed 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    };
    const result = await onSubmit(payload);
    if (result?.success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editTask ? "Edit Task" : "Create New Task"}</h2>
          <button className="modal-close" onClick={onClose}><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={errors.title ? "input-error" : ""}
              autoFocus
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)..."
              rows={3}
              className={errors.description ? "input-error" : ""}
            />
            <div className="char-count">{form.description.length}/500</div>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Tags (max 5)</label>
            <div className="tag-input-wrapper">
              <FiTag size={14} className="tag-icon" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag and press Enter..."
                maxLength={20}
                disabled={form.tags.length >= 5}
              />
              <button type="button" className="btn-add-tag" onClick={addTag} disabled={!tagInput.trim() || form.tags.length >= 5}>
                <FiPlus size={14} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="tags-list">
                {form.tags.map((tag, i) => (
                  <span key={i} className="tag tag-removable">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><FiX size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="spinner-sm" /> Saving...</span>
              ) : (
                <><FiSave size={15} /> {editTask ? "Update Task" : "Create Task"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
