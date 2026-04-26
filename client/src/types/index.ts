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

export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  scheduled: string | null;
  created: string;
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
