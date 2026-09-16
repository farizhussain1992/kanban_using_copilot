export interface CardData {
  id: string;
  title: string;
  details: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  cards: Record<string, CardData>;
  columns: ColumnData[];
}

