import DeleteAllButton from '../DeleteAllButton/DeleteAllButton';
import TodoItem from '../ToDoItem/ToDoItem';
import styles from './ActiveState.module.css';

const ActiveState = ({ tasks, onEdit, onToggle, activePomodoroId, setActivePomodoroId }) => {
	return (
		<div className={styles.activeState}>
			<div className={styles.activeHeader}>
				<h1 className={styles.activeStateCount}>Active tasks ({tasks.length})</h1>
			</div>

			{tasks.map((task) => (
				<TodoItem
					key={task.id}
					task={task}
					onToggle={onToggle}
					onDelete={() => {}}
					onEdit={onEdit}
					activePomodoroId={activePomodoroId}
					setActivePomodoroId={setActivePomodoroId}
				/>
			))}
		</div>
	);
};

export default ActiveState;
