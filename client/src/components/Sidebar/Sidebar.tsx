import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { ListTodo, CheckCircle2, X, Settings as SettingsIcon, LogOut, Plus } from 'lucide-react';
import type { Category } from '../../types';
import CategoryItem from './CategoryItem';
import styles from './Sidebar.module.css';

interface SidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
	selectedCategoryId: number | null;
	onCategorySelect: (id: number | null) => void;
	onCategoryCreate: () => void;
	onCategoryUpdate: (category: Category) => void;
	onCategoryDelete: (id: number) => void;
}

const Sidebar = ({
	activeTab,
	onTabChange,
	isOpen,
	onClose,
	categories,
	selectedCategoryId,
	onCategorySelect,
	onCategoryCreate,
	onCategoryUpdate,
	onCategoryDelete,
}: SidebarProps) => {
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
					<button
						className={`${styles.sidebarItem} ${activeTab === 'active' && selectedCategoryId === null ? styles.active : ''}`}
						onClick={() => {
							onTabChange('active');
							onCategorySelect(null);
							onClose();
						}}>
						<ListTodo size={18} strokeWidth={2} />
						Active Tasks
					</button>
				</nav>

				<div className={styles.categoriesSection}>
					<div className={styles.categoriesHeader}>
						<span className={styles.categoriesLabel}>Categories</span>
						<button
							className={styles.addCategoryBtn}
							onClick={() => {
                onClose();
								onCategoryCreate();
							}}
							title='New category'>
							<Plus size={15} />
						</button>
					</div>

					<button
						className={`${styles.categoryItem} ${selectedCategoryId === null && activeTab === 'active' ? styles.categoryActive : ''}`}
						onClick={() => {
							onCategorySelect(null);
							onTabChange('active');
							onClose();
						}}>
						<span className={styles.categoryAllDot} />
						<span className={styles.categoryName}>All tasks</span>
					</button>

					{categories.map((cat) => (
						<CategoryItem
							key={cat.id}
							category={cat}
							isSelected={selectedCategoryId === cat.id}
							onSelect={() => {
								onCategorySelect(cat.id);
								onTabChange('active');
								onClose();
							}}
							onEdit={() => onCategoryUpdate(cat)}
							onDelete={() => onCategoryDelete(cat.id)}
						/>
					))}
				</div>

				<hr className={styles.divider} />

				<button
					className={`${styles.sidebarItem} ${activeTab === 'completed' && selectedCategoryId === null ? styles.active : ''}`}
					onClick={() => {
						onTabChange('completed');
						onCategorySelect(null);
						onClose();
					}}>
					<CheckCircle2 size={18} strokeWidth={2} />
					Completed Tasks
				</button>

				<div className={styles.bottomActions}>
					<button
						className={`${styles.sidebarItem} ${activeTab === 'settings' && selectedCategoryId === null ? styles.active : ''}`}
						onClick={() => {
							onTabChange('settings');
							onCategorySelect(null);
							onClose();
						}}>
						<SettingsIcon size={18} strokeWidth={2} />
						Settings
					</button>

					<button className={styles.logout} onClick={handleLogout}>
						<LogOut size={18} strokeWidth={2} />
						Log Out
					</button>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
