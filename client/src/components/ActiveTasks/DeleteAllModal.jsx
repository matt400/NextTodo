import styles from './ActiveTasks.module.css';

const DeleteAllModal = ({ onConfirm, onCancel }) => {
	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h3>Delete all tasks?</h3>
				<p>Are you sure you want to delete all active tasks?</p>

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