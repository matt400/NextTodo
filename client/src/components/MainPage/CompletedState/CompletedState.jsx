import TodoItem from '../ToDoItem/ToDoItem';
import styles from './CompletedState.module.css';

const CompletedState = ({ tasks, onEdit, onToggle, onDelete, activePomodoroId, setActivePomodoroId }) => {

	return (
		<div className={`${styles.CompletedState}`}>
			<h1 className={`${styles.CompletedStateCount}`}>Completed tasks ({tasks.length})</h1>

			<div className='completed-list'>
				{tasks.map((task) => (
					<TodoItem
						key={task.id}
						task={task}
						onToggle={onToggle}
						onDelete={onDelete}
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
