import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { updateUserSettings } from '../api/auth';
import type { Theme, ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'auto'
  );
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    const dbTheme = user.settings?.theme;
    if (dbTheme) {
      const localTheme = (dbTheme === 'system' ? 'auto' : dbTheme) as Theme;
      setThemeState(localTheme);
      localStorage.setItem('theme', localTheme);
    }
  }, [loading, user?.id]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (user) {
      const dbTheme = newTheme === 'auto' ? 'system' : newTheme;
      updateUserSettings({ theme: dbTheme }).catch(() => {});
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'auto') {
      root.removeAttribute('data-theme');
      return;
    }

    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
