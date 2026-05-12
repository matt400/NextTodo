import { Pencil, Trash2, Hash } from 'lucide-react';
import type { Tag } from '../../types';
import styles from './Sidebar.module.css';

interface TagItemProps {
  tag: Tag;
  isSelected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TagItem = ({ tag, isSelected, onToggle, onEdit, onDelete }: TagItemProps) => {
  return (
    <button
      className={`${styles.tagItem} ${isSelected ? styles.tagActive : ''}`}
      onClick={onToggle}>
      <span className={styles.categoryIcon} style={{ backgroundColor: tag.color }}>
        <Hash size={14} strokeWidth={2} />
      </span>
      <span className={styles.tagName}>{tag.name}</span>
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

export default TagItem;
