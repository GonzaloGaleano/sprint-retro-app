export type ActionStatus = 'pending' | 'in_progress' | 'completed';

export interface RetroCard {
  id: string;
  text: string;
  author?: string;
  votes: number;
  voters: string[]; // Browser voter UUIDs
  createdAt: number;
}

export interface RetroColumn {
  id: string;
  title: string;
  description?: string;
  cards: RetroCard[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: ActionStatus;
  createdAt: number;
  sourceCardId?: string;
  sourceCardText?: string;
}

export interface RetroMethodColumnDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  headerBorder: string;
  accentColor: string;
  cardAccent: string;
}

export interface RetroMethodDef {
  id: string;
  name: string;
  description: string;
  columns: RetroMethodColumnDef[];
}

export interface RetroSession {
  id: string;
  sprintName: string;
  date: string;
  team: string;
  method: string;
  columns: RetroColumn[];
  actions: ActionItem[];
  completed?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export type SortOrder = 'most_voted' | 'most_recent' | 'original';
