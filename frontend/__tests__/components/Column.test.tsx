import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "../../app/components/Column";
import { ColumnData, CardData } from "../../app/types";

const mockColumn: ColumnData = {
  id: "col-1",
  title: "In Progress",
  cardIds: ["card-1"],
};

const mockCards: CardData[] = [
  {
    id: "card-1",
    title: "Feature A",
    details: "Implementation notes",
  },
];

function renderColumnWithDnd(props: React.ComponentProps<typeof Column>) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Column {...props} />
    </DragDropContext>
  );
}

describe("Column Component", () => {
  it("renders column title and card count", () => {
    renderColumnWithDnd({
      column: mockColumn,
      cards: mockCards,
      onRenameColumn: vi.fn(),
      onAddCard: vi.fn(),
      onDeleteCard: vi.fn(),
      onEditCard: vi.fn(),
    });

    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByLabelText("1 cards")).toHaveTextContent("1");
    expect(screen.getByText("Feature A")).toBeInTheDocument();
  });

  it("shows empty state when no cards exist", () => {
    renderColumnWithDnd({
      column: { ...mockColumn, cardIds: [] },
      cards: [],
      onRenameColumn: vi.fn(),
      onAddCard: vi.fn(),
      onDeleteCard: vi.fn(),
      onEditCard: vi.fn(),
    });

    expect(screen.getByText("No cards")).toBeInTheDocument();
    expect(screen.getByLabelText("0 cards")).toHaveTextContent("0");
  });

  it("calls onAddCard when clicking add buttons", () => {
    const handleAddCard = vi.fn();
    renderColumnWithDnd({
      column: mockColumn,
      cards: mockCards,
      onRenameColumn: vi.fn(),
      onAddCard: handleAddCard,
      onDeleteCard: vi.fn(),
      onEditCard: vi.fn(),
    });

    fireEvent.click(screen.getByLabelText("Add card to In Progress"));
    expect(handleAddCard).toHaveBeenCalledWith("col-1");

    fireEvent.click(screen.getByText("+ Add card"));
    expect(handleAddCard).toHaveBeenCalledWith("col-1");
  });

  it("allows renaming column when clicking Rename button", () => {
    const handleRename = vi.fn();
    renderColumnWithDnd({
      column: mockColumn,
      cards: mockCards,
      onRenameColumn: handleRename,
      onAddCard: vi.fn(),
      onDeleteCard: vi.fn(),
      onEditCard: vi.fn(),
    });

    const renameBtn = screen.getByLabelText("Rename column In Progress");
    fireEvent.click(renameBtn);

    const input = screen.getByLabelText("Rename In Progress");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("In Progress");

    fireEvent.change(input, { target: { value: "Sprint Tasks" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleRename).toHaveBeenCalledWith("col-1", "Sprint Tasks");
  });
});

