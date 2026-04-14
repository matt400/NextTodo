import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from './AuthContext';
import { updateUserSettings } from '../api/auth';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'auto');
	const { user, loading } = useAuth();

	// Sync from DB once when user data loads
	useEffect(() => {
		if (loading || !user) return;
		const dbTheme = user.settings?.theme;
		if (dbTheme) {
			const localTheme = dbTheme === 'system' ? 'auto' : dbTheme;
			setThemeState(localTheme);
			localStorage.setItem('theme', localTheme);
		}
	}, [loading, user?.id]);

	const setTheme = (newTheme) => {
		setThemeState(newTheme);
		localStorage.setItem('theme', newTheme);
		if (user) {
			const dbTheme = newTheme === 'auto' ? 'system' : newTheme;
			updateUserSettings({ theme: dbTheme }).catch(() => {});
		}
	};

	useEffect(() => {
		const root = document.documentElement;

		if (theme === "auto") {
			root.removeAttribute("data-theme");
			return;
		}

		root.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
