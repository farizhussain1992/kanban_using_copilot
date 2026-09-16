"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "todo" | "progress" | "done";
type Card = { id: number; title: string; description: string; status: Status };

const columns: { status: Status; title: string; color: string }[] = [
  { status: "todo", title: "To do", color: "blue" },
  { status: "progress", title: "In progress", color: "amber" },
  { status: "done", title: "Done", color: "green" },
];

const initialCards: Card[] = [
  { id: 1, title: "Plan the project", description: "Define the first milestones and priorities.", status: "todo" },
  { id: 2, title: "Build the board", description: "Create a clean and responsive Kanban experience.", status: "progress" },
  { id: 3, title: "Review README", description: "Document how to run and use the project.", status: "done" },
];

export default function Home() {
  const [cards, setCards] = useState(initialCards);
  const [filter, setFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle("dark-page", darkMode);
    return () => document.body.classList.remove("dark-page");
  }, [darkMode]);

  const visibleCards = useMemo(
    () => cards.filter((card) => `${card.title} ${card.description}`.toLowerCase().includes(filter.toLowerCase())),
    [cards, filter],
  );

  function addCard(status: Status) {
    const title = window.prompt("Task title");
    if (!title?.trim()) return;
    setCards((current) => [
      ...current,
      { id: Date.now(), title: title.trim(), description: "New task", status },
    ]);
  }

  function moveCard(id: number, direction: -1 | 1) {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== id) return card;
        const index = columns.findIndex((column) => column.status === card.status);
        return { ...card, status: columns[Math.max(0, Math.min(columns.length - 1, index + direction))].status };
      }),
    );
  }

  function moveCardToColumn(id: number, status: Status) {
    setCards((current) => current.map((card) => (card.id === id ? { ...card, status } : card)));
  }

  return (
    <main className={`shell ${darkMode ? "dark" : ""}`}>
      <header className="header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Fariz Kanban Board</h1>
          <p className="subtitle">Keep your team moving forward.</p>
        </div>
        <div className="header-actions">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search tasks..." />
          </label>
          <button className="theme-toggle" onClick={() => setDarkMode((enabled) => !enabled)} aria-label="Toggle color theme">
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>
      <section className="board" aria-label="Kanban board">
        {columns.map((column) => {
          const columnCards = visibleCards.filter((card) => card.status === column.status);
          return (
            <article
              className="column"
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedCardId !== null) moveCardToColumn(draggedCardId, column.status);
                setDraggedCardId(null);
              }}
            >
              <div className="column-heading">
                <h2><span className={`dot ${column.color}`} />{column.title}<span className="count">{columnCards.length}</span></h2>
                <button className="icon-button" onClick={() => addCard(column.status)} aria-label={`Add task to ${column.title}`}>+</button>
              </div>
              <div className="cards">
                {columnCards.map((card) => (
                  <div
                    className="card"
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("cardId", String(card.id));
                      setDraggedCardId(card.id);
                    }}
                    onDragEnd={() => setDraggedCardId(null)}
                  >
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div className="card-actions">
                      <button disabled={column.status === "todo"} onClick={() => moveCard(card.id, -1)}>←</button>
                      <button disabled={column.status === "done"} onClick={() => moveCard(card.id, 1)}>→</button>
                    </div>
                  </div>
                ))}
                {columnCards.length === 0 && <p className="empty">No tasks here</p>}
              </div>
              <button className="add-task" onClick={() => addCard(column.status)}>+ Add task</button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
