import { useState, useEffect } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './MainContent.module.css';
import ActiveTasks from '../../components/ActiveTasks';
import CompletedTasks from '../../components/CompletedTasks/CompletedTasks';
import UserSettings from '../../components/UserSettings/UserSettings';
import CategoryModal from '../../components/CategoryModal/CategoryModal';
import { getPomodoro } from '../../api/taskApi';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categoryApi';
import { useAuth } from '../../context/AuthContext';
import { updateUserSettings } from '../../api/auth';
import type { PomoData, Category } from '../../types';

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategoryId(id);
    if (id !== null) setActiveTab('active');
  };

  const handleCategoryCreate = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleCategoryUpdate = (cat: Category) => {
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const handleCategoryDelete = async (id: number) => {
    await deleteCategory(id);
    if (selectedCategoryId === id) setSelectedCategoryId(null);
    await loadCategories();
  };

  const handleCategorySave = async (name: string, color: string, icon: string) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, { name, color, icon });
    } else {
      await createCategory(name, color, icon);
    }
    setShowCategoryModal(false);
    await loadCategories();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <ActiveTasks
            activePomodoroId={activePomodoroId}
            setActivePomodoroId={setActivePomodoroId}
            activePomoData={activePomoData}
            setActivePomoData={setActivePomoData}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
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
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
              onCategoryCreate={handleCategoryCreate}
              onCategoryUpdate={handleCategoryUpdate}
              onCategoryDelete={handleCategoryDelete}
            />

            <main className={styles.dashboardContent}>{renderContent()}</main>
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <CategoryModal
          category={editingCategory ?? undefined}
          onSave={handleCategorySave}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};

export default MainContent;
