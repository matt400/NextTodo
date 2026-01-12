import TodoItem from '../ToDoItem/ToDoItem';
import styles from './CompletedState.module.css';

const CompletedState = ({
	tasks,
	setTasks,
	onEdit,
	activePomodoroId,
	setActivePomodoroId,
}) => {
	const toggleDone = (id) => {
		setTasks((prev) =>
			prev.map((t) => {
				if (t.id === id && !t.done) {
					setActivePomodoroId(null);
				}
				return t.id === id ? { ...t, done: !t.done } : t;
			})
		);
	};

	const deleteTask = (id) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	};

	const editTask = (id) => {
		console.log('Edit completed', id);
	};

	return (
		<div className={`${styles.CompletedState}`}>
			<h1 className={`${styles.CompletedStateCount}`}>
				Completed tasks ({tasks.length})
			</h1>

			<div className='completed-list'>
				{tasks.map((task) => (
					<TodoItem
						key={task.id}
						task={task}
						onToggle={toggleDone}
						onDelete={deleteTask}
						onEdit={onEdit}
						activePomodoroId={activePomodoroId}
						setActivePomodoroId={setActivePomodoroId}
					/>
				))}
			</div>
		</div>
	);
};

export default CompletedState;
