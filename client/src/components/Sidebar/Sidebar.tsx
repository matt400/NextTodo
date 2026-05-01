import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { ListTodo, CheckCircle2, X, Settings as SettingsIcon, LogOut, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

interface Tab {
	id: string;
	label: string;
	icon: LucideIcon;
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
								className={`${styles.sidebarItem} ${activeTab === tab.id && selectedCategoryId === null ? styles.active : ''}`}
								onClick={() => {
									onTabChange(tab.id);
									onCategorySelect(null);
									onClose();
								}}>
								<Icon size={18} strokeWidth={2} />
								{tab.label}
							</button>
						);
					})}
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

				<button className={styles.logout} onClick={handleLogout}>
					<LogOut size={18} strokeWidth={2} />
					Log Out
				</button>
			</aside>
		</>
	);
};

export default Sidebar;
