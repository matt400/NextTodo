import { useState, useEffect } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import styles from './MainContent.module.css';
import ActiveTasks from '../../components/ActiveTasks/ActiveTasks.jsx';
import CompletedTasks from '../../components/CompletedTasks/CompletedTasks.jsx';
import UserSettings from '../../components/UserSettings/UserSettings.jsx';

const MainContent = () => {
	const [activeTab, setActiveTab] = useState('active');
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const renderContent = () => {
		switch (activeTab) {
			case 'active':
				return <ActiveTasks />;
			case 'completed':
				return <CompletedTasks />;
			case 'settings':
				return <UserSettings />;
			default:
				return null;
		}
	};

	useEffect(() => {
		const close = (e) => {
			if (e.key === 'Escape') setIsMenuOpen(false);
		};

		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, []);

	return (
		<div className={styles.dashboard}>
			<div className={styles.dashboardBodyWrapper}>
				<div className={styles.dashboardCard}>
					<Header onBurgerClick={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />

					<div className={styles.dashboardBody}>
						<Sidebar
							activeTab={activeTab}
							onTabChange={setActiveTab}
							isOpen={isMenuOpen}
							onClose={() => setIsMenuOpen(false)}
						/>

						<main className={styles.dashboardContent}>{renderContent()}</main>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainContent;
