import { BoardData } from "./types";

export const initialBoardData: BoardData = {
  cards: {
    "card-1": {
      id: "card-1",
      title: "Design System Tokens",
      details: "Establish core brand color palette, font sizes, and layout grid variables.",
    },
    "card-2": {
      id: "card-2",
      title: "Research Component Libraries",
      details: "Evaluate accessible drag-and-drop primitives compatible with React 19.",
    },
    "card-3": {
      id: "card-3",
      title: "Implement Board Scaffolding",
      details: "Set up 5 columns with flexbox and responsive scrolling support.",
    },
    "card-4": {
      id: "card-4",
      title: "Card Management Interactions",
      details: "Add inline creation and deletion triggers for individual cards.",
    },
    "card-5": {
      id: "card-5",
      title: "Drag and Drop Integration",
      details: "Support reordering within columns and transferring cards between columns.",
    },
    "card-6": {
      id: "card-6",
      title: "Quality Assurance and Tests",
      details: "Validate component rendering, rename workflows, and end-to-end user flows.",
    },
    "card-7": {
      id: "card-7",
      title: "Repository Initialization",
      details: "Configure Next.js 15 App Router directory, TypeScript strict mode, and tooling.",
    },
  },
  columns: [
    {
      id: "col-1",
      title: "Backlog",
      cardIds: ["card-1", "card-2"],
    },
    {
      id: "col-2",
      title: "To Do",
      cardIds: ["card-3"],
    },
    {
      id: "col-3",
      title: "In Progress",
      cardIds: ["card-4"],
    },
    {
      id: "col-4",
      title: "Review",
      cardIds: ["card-5"],
    },
    {
      id: "col-5",
      title: "Done",
      cardIds: ["card-6", "card-7"],
    },
  ],
};

