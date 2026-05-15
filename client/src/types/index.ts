import type { Dispatch, SetStateAction } from 'react';

export interface UserSettings {
  theme?: string;
  notificationType?: string;
  pomodoroTime?: number;
  view?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  settings?: UserSettings;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  _count?: { tasks: number };
}

export type CategoryColor =
  | '#ef4444'
  | '#f97316'
  | '#eab308'
  | '#22c55e'
  | '#14b8a6'
  | '#3b82f6'
  | '#8b5cf6'
  | '#ec4899'
  | '#64748b'
  | '#84cc16'
  | '#06b6d4'
  | '#f43f5e';

export interface Tag {
  id: number;
  name: string;
  color: string;
  _count?: { tasks: number };
}

export type TagColor = CategoryColor;

export const MAX_TAGS_PER_TASK = 10;

export type CategoryIcon =
  | 'Briefcase'
  | 'Home'
  | 'Book'
  | 'Heart'
  | 'Star'
  | 'ShoppingCart'
  | 'Dumbbell'
  | 'Code'
  | 'Music'
  | 'Camera'
  | 'Plane'
  | 'Car'
  | 'Coffee'
  | 'Gamepad2'
  | 'Palette'
  | 'Globe'
  | 'Leaf'
  | 'Zap'
  | 'Target'
  | 'Users';

export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  scheduled: string | null;
  created: string;
  categoryId: number | null;
  category: Category | null;
  sortOrder: number;
  tags?: Tag[];
}

export interface PomoData {
  id: number;
  taskId: number;
  startedAt: string;
  endedAt: string | null;
  duration: number;
  elapsed: number;
  pausedAt: string | null;
}

export interface PomoRecord {
  id: number;
  taskName: string;
  startedAt: string;
  endedAt: string | null;
  elapsed: number;
  duration: number;
}

export type Theme = 'auto' | 'light' | 'dark';
export type FeedbackType = 'toast' | 'inline';
export type ToastType = 'success' | 'error' | 'info';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface FeedbackContextValue {
  feedbackType: FeedbackType;
  setFeedbackType: (type: FeedbackType) => void;
}
