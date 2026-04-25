import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { ListTodo, CheckCircle2, X, Settings as SettingsIcon, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) => {
  const tabs: Tab[] = [
    { id: 'active', label: 'Active Tasks', icon: ListTodo },
    { id: 'completed', label: 'Completed Tasks', icon: CheckCircle2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
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

        <button className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} />
          Log Out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
