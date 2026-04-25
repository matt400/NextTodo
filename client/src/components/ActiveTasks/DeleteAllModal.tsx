import styles from './ActiveTasks.module.css';

interface DeleteAllModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  type: 'active' | 'completed';
}

const DeleteAllModal = ({ onConfirm, onCancel, type }: DeleteAllModalProps) => {
  const isActive = type === 'active';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Delete all {isActive ? 'active' : 'completed'} tasks?</h3>
        <p>Are you sure you want to delete all {isActive ? 'active' : 'completed'} tasks?</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllModal;
