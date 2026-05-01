import { useState } from 'react';
import {
  X,
  Check,
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category, CategoryColor, CategoryIcon } from '../../types';
import styles from './CategoryModal.module.css';

const ALLOWED_COLORS: CategoryColor[] = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#84cc16',
  '#06b6d4',
  '#f43f5e',
];

const ALLOWED_ICONS: CategoryIcon[] = [
  'Briefcase',
  'Home',
  'Book',
  'Heart',
  'Star',
  'ShoppingCart',
  'Dumbbell',
  'Code',
  'Music',
  'Camera',
  'Plane',
  'Car',
  'Coffee',
  'Gamepad2',
  'Palette',
  'Globe',
  'Leaf',
  'Zap',
  'Target',
  'Users',
];

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

interface CategoryModalProps {
  category?: Category;
  onSave: (name: string, color: string, icon: string) => void;
  onClose: () => void;
}

const CategoryModal = ({ category, onSave, onClose }: CategoryModalProps) => {
  const [name, setName] = useState(category?.name ?? '');
  const [selectedColor, setSelectedColor] = useState<string>(category?.color ?? ALLOWED_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string>(category?.icon ?? ALLOWED_ICONS[0]);
  const [nameError, setNameError] = useState('');

  const validate = (value: string): string => {
    if (!value.trim()) return 'Name is required';
    if (value.length > 40) return 'Name must be 40 characters or less';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate(name);
    if (error) {
      setNameError(error);
      return;
    }
    onSave(name.trim(), selectedColor, selectedIcon);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{category ? 'Edit Category' : 'New Category'}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor='categoryName'>Name</label>
            <input
              id='categoryName'
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(validate(e.target.value));
              }}
              className={`${styles.input} ${nameError ? styles.inputError : ''}`}
              placeholder='e.g. Work, Study, Personal...'
              autoFocus
              maxLength={40}
            />
            {nameError && <p className={styles.inputErrorMsg}>{nameError}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Color</label>
            <div className={styles.colorGrid}>
              {ALLOWED_COLORS.map((color) => (
                <button
                  key={color}
                  type='button'
                  className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}>
                  {selectedColor === color && <Check size={14} color='white' strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Icon</label>
            <div className={styles.iconGrid}>
              {ALLOWED_ICONS.map((iconName) => {
                const Icon = ICON_MAP[iconName];
                return (
                  <button
                    key={iconName}
                    type='button'
                    className={`${styles.iconOption} ${selectedIcon === iconName ? styles.selected : ''}`}
                    onClick={() => setSelectedIcon(iconName)}
                    title={iconName}>
                    <Icon size={18} strokeWidth={1.8} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.footer}>
            <button type='button' onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
              Cancel
            </button>
            <button type='submit' className={`${styles.btn} ${styles.save}`}>
              {category ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
