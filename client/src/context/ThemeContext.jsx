import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

	useEffect(() => {
		localStorage.setItem('theme', theme);
	}, [theme]);

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