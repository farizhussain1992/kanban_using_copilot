"use client";

import dynamic from "next/dynamic";

const Board = dynamic(() => import("./components/Board").then((mod) => mod.Board), {
  ssr: false,
  loading: () => (
    <div className="board-shell">
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
      </header>
    </div>
  ),
});

export default function Home() {
  return <Board />;
}
