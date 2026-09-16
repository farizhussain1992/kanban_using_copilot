import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Card } from "../../app/components/Card";
import { CardData } from "../../app/types";

const mockCard: CardData = {
  id: "card-1",
  title: "Test Task",
  details: "Test task details and notes",
};

function renderWithDnd(ui: React.ReactElement) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="test-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ui}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

describe("Card Component", () => {
  it("renders card title and details", () => {
    renderWithDnd(
      <Card
        card={mockCard}
        index={0}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test task details and notes")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const handleDelete = vi.fn();
    renderWithDnd(
      <Card
        card={mockCard}
        index={0}
        onDelete={handleDelete}
        onEdit={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText("Delete Test Task");
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith("card-1");
  });

  it("calls onEdit when card is clicked", () => {
    const handleEdit = vi.fn();
    renderWithDnd(
      <Card
        card={mockCard}
        index={0}
        onDelete={vi.fn()}
        onEdit={handleEdit}
      />
    );

    const cardElement = screen.getByRole("button", { name: "Card: Test Task" });
    fireEvent.click(cardElement);

    expect(handleEdit).toHaveBeenCalledWith(mockCard);
  });
});

