import {
  Briefcase,
  Home,
  Book,
  Heart,
  Star,
  ShoppingCart,
  Dumbbell,
  Code,
  Music,
  Camera,
  Plane,
  Car,
  Coffee,
  Gamepad2,
  Palette,
  Globe,
  Leaf,
  Zap,
  Target,
  Users,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category, CategoryIcon } from '../../types';
import styles from './Sidebar.module.css';

const ICON_MAP: Record<CategoryIcon, LucideIcon> = {
  Briefcase,
  Home,
  Book,
  Heart,
  Star,
  ShoppingCart,
  Dumbbell,
  Code,
  Music,
  Camera,
  Plane,
  Car,
  Coffee,
  Gamepad2,
  Palette,
  Globe,
  Leaf,
  Zap,
  Target,
  Users,
};

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem = ({ category, isSelected, onSelect, onEdit, onDelete }: CategoryItemProps) => {
  const Icon = ICON_MAP[category.icon as CategoryIcon] ?? Briefcase;

  return (
    <button
      className={`${styles.categoryItem} ${isSelected ? styles.categoryActive : ''}`}
      onClick={onSelect}>
      <span className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
        <Icon size={14} strokeWidth={2} />
      </span>
      <span className={styles.categoryName}>{category.name}</span>
      <span className={styles.categoryActions}>
        <button
          className={styles.categoryActionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title='Edit'>
          <Pencil size={13} />
        </button>
        <button
          className={`${styles.categoryActionBtn} ${styles.categoryDeleteBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title='Delete'>
          <Trash2 size={13} />
        </button>
      </span>
    </button>
  );
};

export default CategoryItem;
