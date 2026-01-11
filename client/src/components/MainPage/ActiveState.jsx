import DeleteAllButton from './DeleteAllButton';
import TodoItem from './ToDoItem';

const ActiveState = ({
	tasks,
	setTasks,
	onEdit,
	activePomodoroId,
	setActivePomodoroId,
}) => {
	const handleDeleteAll = () => {
		setTasks((prev) => prev.filter((t) => t.done));
	};

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

	return (
		<div className='empty-state'>
			<div className='active-header'>
				<h1>Active tasks ({tasks.length})</h1>
				<DeleteAllButton onClick={handleDeleteAll} />
			</div>

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
	);
};

export default ActiveState;
