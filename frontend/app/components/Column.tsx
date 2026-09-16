"use client";

import React, { useState, useRef, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnData, CardData } from "../types";
import { Card } from "./Card";

interface ColumnProps {
  column: ColumnData;
  cards: CardData[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onAddCard: (columnId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (card: CardData) => void;
}

export function Column({
  column,
  cards,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
  onEditCard,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleText(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleFinishRename = () => {
    const trimmed = titleText.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitleText(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFinishRename();
    } else if (e.key === "Escape") {
      setTitleText(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="kanban-column" data-testid={`column-${column.id}`}>
      <div className="column-header">
        <div className="column-title-container">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              className="column-title-input"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={handleKeyDown}
              aria-label={`Rename ${column.title}`}
            />
          ) : (
            <h2
              className="column-title"
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Double-click to rename"
            >
              {column.title}
            </h2>
          )}
          <span className="column-count-badge" aria-label={`${cards.length} cards`}>
            {cards.length}
          </span>
        </div>

        <div className="column-header-actions">
          <button
            type="button"
            className="column-rename-btn"
            onClick={() => setIsEditingTitle(true)}
            aria-label={`Rename column ${column.title}`}
            title="Rename column"
          >
            Rename
          </button>
          <button
            type="button"
            className="column-add-btn"
            onClick={() => onAddCard(column.id)}
            aria-label={`Add card to ${column.title}`}
            title="Add card"
          >
            +
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-card-list ${snapshot.isDraggingOver ? "is-dragging-over" : ""}`}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onDelete={onDeleteCard}
                onEdit={onEditCard}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty-state">No cards</div>
            )}
          </div>
        )}
      </Droppable>

      <button
        type="button"
        className="column-add-card-footer-btn"
        onClick={() => onAddCard(column.id)}
      >
        + Add card
      </button>
    </div>
  );
}

