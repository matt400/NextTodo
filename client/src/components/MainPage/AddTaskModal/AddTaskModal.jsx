import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import styles from './AddTaskModal.module.css';

const AddTaskModal = ({ onAdd, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [inputError, setInputError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateTaskName = (name) => {
    if (!name.trim()) return 'Task name cannot be empty';
    if (name.length > 50) return 'Task name must be less than 50 characters';

    const allowedPattern = /^[\p{L}\p{N}\s.,!?'-]+$/u;
    if (!allowedPattern.test(name)) {
      return 'Task name contains unsupported characters. Only letters, numbers, and basic punctuation are allowed.';
    }
    return '';
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setServerError('');

    const error = validateTaskName(taskName);
    if (error) {
      setInputError(error);
      return;
    }

    if (taskName.toLowerCase().includes('forbidden')) {
      setServerError(
        'Task creation failed: Task name contains forbidden content. Please try a different name.'
      );
      return;
    }

    onAdd(taskName);
    setTaskName('');
    setInputError('');
    setServerError('');
    onClose();
  };

  const handleChange = (value) => {
    setTaskName(value);
    if (inputError) {
      setInputError(validateTaskName(value));
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h3 className={styles.title}>Add New Task</h3>
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleAddTask} className={styles.form}>
        {serverError && (
          <div className={styles.errorBox}>
            <AlertCircle size={16} className={styles.errorIcon} />
            <p className={styles.errorText}>{serverError}</p>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="newTaskName">Task Name</label>
          <input
            id="newTaskName"
            type="text"
            value={taskName}
            onChange={(e) => handleChange(e.target.value)}
            className={`${styles.input} ${inputError ? styles.inputError : ''}`}
            placeholder="Enter task name..."
            autoFocus
          />
          {inputError && <p className={styles.inputErrorMsg}>{inputError}</p>}
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
            Cancel
          </button>
          <button type="submit" className={`${styles.btn} ${styles.add}`}>
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskModal;
