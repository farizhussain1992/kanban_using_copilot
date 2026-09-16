"use client";

import React, { useState, useEffect } from "react";

interface CardModalProps {
  isOpen: boolean;
  initialTitle?: string;
  initialDetails?: string;
  columnTitle?: string;
  isEditing?: boolean;
  onSave: (title: string, details: string) => void;
  onClose: () => void;
}

export function CardModal({
  isOpen,
  initialTitle = "",
  initialDetails = "",
  columnTitle,
  isEditing = false,
  onSave,
  onClose,
}: CardModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [details, setDetails] = useState(initialDetails);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialTitle);
    setDetails(initialDetails);
    setError("");
  }, [initialTitle, initialDetails, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }
    onSave(trimmedTitle, details.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="modal-heading" className="modal-title">
            {isEditing ? "Edit Card" : columnTitle ? `Add Card to ${columnTitle}` : "Add Card"}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="card-title-input" className="form-label">
              Title
            </label>
            <input
              id="card-title-input"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter card title..."
              autoFocus
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="card-details-input" className="form-label">
              Details
            </label>
            <textarea
              id="card-details-input"
              className="form-textarea"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter card details..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? "Save Changes" : "Add Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

