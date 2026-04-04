import { useState, useEffect } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import styles from './MainContent.module.css';
import ActiveTasks from '../../components/ActiveTasks';
import CompletedTasks from '../../components/CompletedTasks/CompletedTasks.jsx';
import UserSettings from '../../components/UserSettings/UserSettings.jsx';
import { getPomodoro } from '../../api/taskApi';

const MainContent = () => {
	const [activeTab, setActiveTab] = useState('active');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const [activePomodoroId, setActivePomodoroId] = useState(null);
	const [activePomoData, setActivePomoData] = useState(null);

	const renderContent = () => {
		switch (activeTab) {
			case 'active':
				return (
					<ActiveTasks
						activePomodoroId={activePomodoroId}
						setActivePomodoroId={setActivePomodoroId}
						activePomoData={activePomoData}
						setActivePomoData={setActivePomoData}
					/>
				);
			case 'completed':
				return <CompletedTasks />;
			case 'settings':
				return <UserSettings isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />;
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

	useEffect(() => {
		const fetchActive = async () => {
			const storedTaskId = Number(localStorage.getItem('activePomodoroTaskId'));
			if (!storedTaskId) return;

			const data = await getPomodoro(storedTaskId);

			if (data && data.endedAt === null) {
				setActivePomodoroId(data.taskId);
				setActivePomoData(data);
			} else {
				localStorage.removeItem('activePomodoroTaskId');
			}
		};

		fetchActive();
	}, []);

	return (
		<div className={`${styles.dashboard} ${isFullscreen ? styles.fullscreen : ''}`}>
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
