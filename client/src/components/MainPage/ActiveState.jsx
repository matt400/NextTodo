import DeleteAllButton from './DeleteAllButton';
import TodoItem from './ToDoItem';

const ActiveState = ({ tasks, setTasks, onEdit }) => {
	const handleDeleteAll = () => {
		setTasks([]);
	};

	const toggleDone = (id) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
		);
	};

	const deleteTask = (id) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	};

	const editTask = (id) => {
		console.log('Editing', id);
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
				/>
			))}
		</div>
	);
};

export default ActiveState;
