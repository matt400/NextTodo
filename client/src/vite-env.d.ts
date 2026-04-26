/// <reference types="vite/client" />

declare global {
  interface WindowEventMap {
    pomodoroUpdate: CustomEvent<{ pomodoroTime: number }>;
  }
}
