import styles from './EmptyState.module.css';

const EmptyState = () => {
	return (
		<div className={`${styles.emptyState}`}>
			<h1 className={`${styles.emptyStateCount}`}>Active tasks (0)</h1>
			<p className={`${styles.emptyStateText}`}>No active tasks. Add a new task to get started!</p>
		</div>
	);
};

export default EmptyState;
