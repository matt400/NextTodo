import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

import { ListTodo, CheckCircle2, X, Settings as SettingsIcon, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
	const tabs = [
		{ id: 'active', label: 'Active Tasks', icon: ListTodo },
		{ id: 'completed', label: 'Completed Tasks', icon: CheckCircle2 },
		{ id: 'settings', label: 'Settings', icon: SettingsIcon },
	];

	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<>
			{isOpen && <div className={styles.overlay} onClick={onClose} />}

			<aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
				<button className={styles.closeBtn} onClick={onClose}>
					<X size={32} />
				</button>

				<nav className={styles.nav}>
					{tabs.map((tab) => {
						const Icon = tab.icon;

						return (
							<button
								key={tab.id}
								className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.active : ''}`}
								onClick={() => {
									onTabChange(tab.id);
									onClose();
								}}>
								<Icon size={18} strokeWidth={2} />
								{tab.label}
							</button>
						);
					})}
				</nav>

				<button className={styles.logout}>
					<LogOut size={18} strokeWidth={2} onClick={handleLogout}/>
					Log Out
				</button>
			</aside>
		</>
	);
};

export default Sidebar;
