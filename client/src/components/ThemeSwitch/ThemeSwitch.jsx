import { useTheme } from '../../context/ThemeContext';

import { Sun, Moon, Monitor } from "lucide-react";
import styles from './ThemeSwitch.module.css';

const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className={styles.wrapper}>
			<button className={theme === 'auto' ? styles.active : ''} onClick={() => setTheme('auto')}>
				Auto <Monitor size = {16}/>
			</button>

			<button className={theme === 'light' ? styles.active : ''} onClick={() => setTheme('light')}>
				Light
				<Sun size = {16}/>
			</button>

			<button className={theme === 'dark' ? styles.active : ''} onClick={() => setTheme('dark')}>
				Dark
				<Moon size = {16}/>
			</button>
			
		</div>
	);
};

export default ThemeSwitch;
