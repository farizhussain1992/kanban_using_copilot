"use client";

import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardData, CardData } from "../types";
import { initialBoardData } from "../data";
import { Column } from "./Column";
import { CardModal } from "./CardModal";

export function Board() {
  const [boardData, setBoardData] = useState<BoardData>(initialBoardData);
  const [darkMode, setDarkMode] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColIndex = boardData.columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIndex = boardData.columns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = boardData.columns[sourceColIndex];
    const destCol = boardData.columns[destColIndex];

    // Dropped in the same column at different index
    if (source.droppableId === destination.droppableId) {
      const newCardIds = Array.from(sourceCol.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumns = [...boardData.columns];
      newColumns[sourceColIndex] = {
        ...sourceCol,
        cardIds: newCardIds,
      };

      setBoardData({
        ...boardData,
        columns: newColumns,
      });
      return;
    }

    // Dropped into another column
    const sourceCardIds = Array.from(sourceCol.cardIds);
    sourceCardIds.splice(source.index, 1);

    const destCardIds = Array.from(destCol.cardIds);
    destCardIds.splice(destination.index, 0, draggableId);

    const newColumns = [...boardData.columns];
    newColumns[sourceColIndex] = {
      ...sourceCol,
      cardIds: sourceCardIds,
    };
    newColumns[destColIndex] = {
      ...destCol,
      cardIds: destCardIds,
    };

    setBoardData({
      ...boardData,
      columns: newColumns,
    });
  };

  const handleOpenAddModal = (columnId: string) => {
    setTargetColumnId(columnId);
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (card: CardData) => {
    setEditingCard(card);
    setTargetColumnId(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTargetColumnId(null);
    setEditingCard(null);
  };

  const handleSaveModal = (title: string, details: string) => {
    if (editingCard) {
      // Edit existing card
      setBoardData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [editingCard.id]: {
            ...editingCard,
            title,
            details,
          },
        },
      }));
    } else if (targetColumnId) {
      // Add new card
      const newCardId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newCard: CardData = {
        id: newCardId,
        title,
        details,
      };

      setBoardData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [newCardId]: newCard,
        },
        columns: prev.columns.map((col) =>
          col.id === targetColumnId
            ? { ...col, cardIds: [...col.cardIds, newCardId] }
            : col
        ),
      }));
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setBoardData((prev) => {
      const updatedCards = { ...prev.cards };
      delete updatedCards[cardId];

      const updatedColumns = prev.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      }));

      return {
        cards: updatedCards,
        columns: updatedColumns,
      };
    });
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    }));
  };

  const targetColumn = boardData.columns.find((col) => col.id === targetColumnId);

  return (
    <div className={`board-shell ${darkMode ? "dark-theme" : ""}`}>
      <header className="board-header">
        <div className="board-header-content">
          <div className="board-title-wrapper">
            <span className="board-accent-badge" />
            <h1 className="board-title">Project Board</h1>
          </div>
          <p className="board-subtitle">
            Manage your project workflow across 5 continuous delivery stages.
          </p>
        </div>
        <div className="board-header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="board-content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns-container">
            {boardData.columns.map((column) => {
              const columnCards = column.cardIds
                .map((id) => boardData.cards[id])
                .filter(Boolean);

              return (
                <Column
                  key={column.id}
                  column={column}
                  cards={columnCards}
                  onRenameColumn={handleRenameColumn}
                  onAddCard={handleOpenAddModal}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleOpenEditModal}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      <CardModal
        isOpen={modalOpen}
        initialTitle={editingCard?.title || ""}
        initialDetails={editingCard?.details || ""}
        columnTitle={targetColumn?.title}
        isEditing={Boolean(editingCard)}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
