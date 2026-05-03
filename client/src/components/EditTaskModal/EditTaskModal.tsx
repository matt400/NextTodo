import { useState } from 'react';
import { X, Pencil, AlertCircle } from 'lucide-react';
import type { Task, Category } from '../../types';
import styles from './EditTaskModal.module.css';

interface EditTaskModalProps {
  task: Task;
  onUpdate: (id: number, updates: { title: string; description: string; categoryId: number | null }) => void;
  onClose: () => void;
  categories: Category[];
}

const EditTaskModal = ({ task, onUpdate, onClose, categories }: EditTaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [categoryId, setCategoryId] = useState<number | null>(task.categoryId);
  const [inputError, setInputError] = useState('');

  const validateTitle = (value: string): string => {
    if (!value.trim()) return 'Title is required';
    if (value.length > 50) return 'Title must be less than 50 characters';

    const allowedPattern = /^[\p{L}\p{N}\s.,!?'"/:()#\p{Pd}]+$/u;
    if (!allowedPattern.test(value)) {
      return 'Title contains unsupported characters.';
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateTitle(title);
    if (err) {
      setInputError(err);
      return;
    }

    onUpdate(task.id, { title, description, categoryId });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Edit Task</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor='editTaskTitle'>Task Title</label>

            <input
              id='editTaskTitle'
              type='text'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (inputError) {
                  setInputError(validateTitle(e.target.value));
                }
              }}
              className={`${styles.input} ${inputError ? styles.inputError : ''}`}
              autoFocus
            />

            {inputError && (
              <p className={styles.inputErrorMsg}>
                <AlertCircle size={14} />
                {inputError}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Description (optional)</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              placeholder='Enter description...'
            />
          </div>

          {categories.length > 0 && (
            <div className={styles.inputGroup}>
              <label>Category (optional)</label>
              <select
                className={styles.input}
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}>
                <option value=''>No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.footer}>
            <button type='button' onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
              Cancel
            </button>

            <button type='submit' className={`${styles.btn} ${styles.add}`}>
              <Pencil size={16} />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
