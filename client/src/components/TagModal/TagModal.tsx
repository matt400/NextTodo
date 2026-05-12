import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Tag, TagColor } from '../../types';
import styles from './TagModal.module.css';

const ALLOWED_COLORS: TagColor[] = [
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

interface TagModalProps {
  tag?: Tag;
  onSave: (name: string, color: string) => void;
  onClose: () => void;
}

const TagModal = ({ tag, onSave, onClose }: TagModalProps) => {
  const [name, setName] = useState(tag?.name ?? '');
  const [selectedColor, setSelectedColor] = useState<string>(tag?.color ?? '#64748b');
  const [nameError, setNameError] = useState('');

  const validate = (value: string): string => {
    if (!value.trim()) return 'Name is required';
    if (value.length > 30) return 'Name must be 30 characters or less';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate(name);
    if (error) {
      setNameError(error);
      return;
    }
    onSave(name.trim(), selectedColor);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{tag ? 'Edit Tag' : 'Add New Tag'}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor='tagName'>Name</label>
            <input
              id='tagName'
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(validate(e.target.value));
              }}
              className={`${styles.input} ${nameError ? styles.inputError : ''}`}
              placeholder='e.g. urgent, idea, blocked...'
              autoFocus
              maxLength={30}
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

          <div className={styles.footer}>
            <button type='button' onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
              Cancel
            </button>
            <button type='submit' className={`${styles.btn} ${styles.save}`}>
              {tag ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagModal;
