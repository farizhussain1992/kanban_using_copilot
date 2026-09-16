"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { CardData } from "../types";

interface CardProps {
  card: CardData;
  index: number;
  onDelete: (cardId: string) => void;
  onEdit: (card: CardData) => void;
}

export function Card({ card, index, onDelete, onEdit }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? "is-dragging" : ""}`}
          onClick={(e) => {
            if (!snapshot.isDragging) {
              onEdit(card);
            }
          }}
          aria-label={`Card: ${card.title}`}
        >
          <div className="card-top-bar">
            <h3 className="card-title">{card.title}</h3>
            <button
              type="button"
              className="card-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              aria-label={`Delete ${card.title}`}
              title="Delete card"
            >
              &times;
            </button>
          </div>
          {card.details && <p className="card-details">{card.details}</p>}
        </div>
      )}
    </Draggable>
  );
}

