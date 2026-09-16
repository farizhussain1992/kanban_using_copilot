import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CardModal } from "../../app/components/CardModal";

describe("CardModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <CardModal
        isOpen={false}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders with add title and empty fields by default", () => {
    render(
      <CardModal
        isOpen={true}
        columnTitle="Backlog"
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add Card to Backlog")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter card title...")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter card details...")).toHaveValue("");
  });

  it("renders with edit title and initial values when isEditing is true", () => {
    render(
      <CardModal
        isOpen={true}
        isEditing={true}
        initialTitle="Existing Title"
        initialDetails="Existing Details"
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Edit Card")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Details")).toBeInTheDocument();
  });

  it("displays error when submitting with empty title", () => {
    const handleSave = vi.fn();
    render(
      <CardModal
        isOpen={true}
        onSave={handleSave}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Card" }));
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("calls onSave and onClose with valid inputs", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();
    render(
      <CardModal
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter card title..."), {
      target: { value: "New Feature" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter card details..."), {
      target: { value: "Detailed spec" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Card" }));
    expect(handleSave).toHaveBeenCalledWith("New Feature", "Detailed spec");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel or close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <CardModal
        isOpen={true}
        onSave={vi.fn()}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});

