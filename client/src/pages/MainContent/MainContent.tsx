import { useState, useEffect } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './MainContent.module.css';
import ActiveTasks from '../../components/ActiveTasks';
import CompletedTasks from '../../components/CompletedTasks/CompletedTasks';
import UserSettings from '../../components/UserSettings/UserSettings';
import { getPomodoro } from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import { updateUserSettings } from '../../api/auth';
import type { PomoData } from '../../types';

type Tab = 'active' | 'completed' | 'settings';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreenState] = useState(
    localStorage.getItem('isFullscreen') === 'true'
  );

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const dbView = user.settings?.view;
    if (dbView) {
      const fullscreen = dbView === 'full';
      setIsFullscreenState(fullscreen);
      localStorage.setItem('isFullscreen', String(fullscreen));
    }
  }, [user?.id]);

  const setIsFullscreen = (value: boolean) => {
    setIsFullscreenState(value);
    localStorage.setItem('isFullscreen', String(value));
    if (user) {
      updateUserSettings({ view: value ? 'full' : 'window' }).catch(() => {});
    }
  };

  const [activePomodoroId, setActivePomodoroId] = useState<number | null>(null);
  const [activePomoData, setActivePomoData] = useState<PomoData | null>(null);

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
    const close = (e: KeyboardEvent) => {
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

      if (data === null) return;

      if (data.endedAt === null) {
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
          <Header onBurgerClick={() => setIsMenuOpen(true)} />

          <div className={styles.dashboardBody}>
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as Tab)}
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
