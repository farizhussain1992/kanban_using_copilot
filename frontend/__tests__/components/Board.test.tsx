import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Board } from "../../app/components/Board";

describe("Board Component", () => {
  it("renders board title and 5 columns with initial data", async () => {
    render(<Board />);

    expect(screen.getByText("Project Board")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your project workflow across 5 continuous delivery stages.")
    ).toBeInTheDocument();

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();

    // Verify initial cards appear
    expect(screen.getByText("Design System Tokens")).toBeInTheDocument();
    expect(screen.getByText("Drag and Drop Integration")).toBeInTheDocument();
  });

  it("adds a new card to a column", async () => {
    render(<Board />);

    // Click add on Backlog
    const addButtons = screen.getAllByLabelText(/Add card to Backlog/i);
    fireEvent.click(addButtons[0]);

    // Modal should appear
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Enter title and details
    fireEvent.change(screen.getByPlaceholderText("Enter card title..."), {
      target: { value: "New Brand Colors" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter card details..."), {
      target: { value: "Verify WCAG contrast ratios" },
    });

    // Save
    fireEvent.click(screen.getByRole("button", { name: "Add Card" }));

    // Verify card is added
    await waitFor(() => {
      expect(screen.getByText("New Brand Colors")).toBeInTheDocument();
      expect(screen.getByText("Verify WCAG contrast ratios")).toBeInTheDocument();
    });
  });

  it("deletes a card when delete button is clicked", async () => {
    render(<Board />);

    expect(screen.getByText("Design System Tokens")).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText("Delete Design System Tokens");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText("Design System Tokens")).not.toBeInTheDocument();
    });
  });

  it("renames a column", async () => {
    render(<Board />);

    const renameBtn = screen.getByLabelText("Rename column Backlog");
    fireEvent.click(renameBtn);

    const input = screen.getByLabelText("Rename Backlog");
    fireEvent.change(input, { target: { value: "Ideas" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Ideas")).toBeInTheDocument();
      expect(screen.queryByText("Backlog")).not.toBeInTheDocument();
    });
  });

  it("toggles dark theme", () => {
    const { container } = render(<Board />);
    const boardShell = container.querySelector(".board-shell");
    expect(boardShell).not.toHaveClass("dark-theme");

    const toggleBtn = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleBtn).toHaveTextContent("Dark Mode");

    fireEvent.click(toggleBtn);
    expect(boardShell).toHaveClass("dark-theme");
    expect(toggleBtn).toHaveTextContent("Light Mode");

    fireEvent.click(toggleBtn);
    expect(boardShell).not.toHaveClass("dark-theme");
    expect(toggleBtn).toHaveTextContent("Dark Mode");
  });
});

