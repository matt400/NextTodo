import { useAuth } from '../../context/AuthContext.jsx';
import { CheckSquare, Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ onBurgerClick }) => {
	const { user } = useAuth();

	return (
		<header className={`${styles.dashboardHeader}`}>
			<div className={styles.logo}>
				<CheckSquare size={26} strokeWidth={2.2} />
				<span>NextTodo</span>
			</div>

			<div className={styles.headerRight}>
				<span className={styles.loggedAs}>
					Welcome back, <strong>{user?.username}</strong>
				</span>

				<button className={styles.burger} onClick={onBurgerClick}>
					<Menu size={28} strokeWidth={2} />
				</button>
			</div>
		</header>
	);
};

export default Header;
