import { useEffect, useState } from 'react';
import {
	fetchTasks,
	addTask as apiAddTask,
	updateTask as apiUpdateTask,
	deleteTask as apiDeleteTask,
} from '../../api/taskApi';

import ToDoItem from '../ToDoItem';
import CreateTaskButton from '../CreateTaskButton';
import AddTaskModal from '../AddTaskModal';
import DeleteAllButton from '../DeleteAllButton';
import Loader from '../Loader';

import { Plus, Search } from 'lucide-react';

import styles from './ActiveTasks.module.css';

const ActiveTasks = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const activeTasks = tasks.filter((task) => !task.done);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [activePomodoroId, setActivePomodoroId] = useState(null);

	const loadTasks = async () => {
		setLoading(true);

		const data = await fetchTasks();
		setTasks(data);
		setLoading(false);
	};

	useEffect(() => {
		(async () => {
			const data = await fetchTasks();
			setTasks(data);
			setLoading(false);
		})();
	}, []);

	const addTask = async ({ title, description }) => {
		await apiAddTask(title, description);
		await loadTasks();
	};

	const toggleTask = async (id) => {
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		await apiUpdateTask(id, {
			isFinished: !task.done,
		});

		await loadTasks();
	};

	const deleteTask = async (id) => {
		await apiDeleteTask(id);
		await loadTasks();
	};

	const deleteAllActive = async () => {
		const confirmed = window.confirm('Delete all active tasks?');
		if (!confirmed) return;

		await Promise.all(activeTasks.map((task) => apiDeleteTask(task.id)));

		await loadTasks();
	};

	const updateTask = async (id, updates) => {
		await apiUpdateTask(id, updates);
		await loadTasks();
	};

	return (
		<div className={styles.container}>
			{loading && <Loader />}

			{activeTasks.length > 0 && (
				<div className={styles.activeHeader}>
					<h2 className={styles.activeTasksCount}>Active tasks ({activeTasks.length})</h2>
					<DeleteAllButton onClick={deleteAllActive} />
				</div>
			)}

			<div className={styles.tasksList}>
				{activeTasks.length === 0 ? (
					<div className={styles.emptyState}>
						<div className={styles.emptyContainer}>
							<Search size={48} />
							<h3>No active tasks</h3>
							<p>Create your first task to get started</p>

						</div>
					</div>
				) : (
					activeTasks.map((task) => (
						<ToDoItem
							key={task.id}
							task={task}
							onToggle={toggleTask}
							onDelete={deleteTask}
							onEdit={updateTask}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>
					))
				)}
			</div>

			<div className={styles.activeFooter}>
				<CreateTaskButton onClick={() => setShowCreateModal(true)}>
					<Plus /> Create New Task
				</CreateTaskButton>
			</div>

			{showCreateModal && <AddTaskModal onAdd={addTask} onClose={() => setShowCreateModal(false)} />}
		</div>
	);
};

export default ActiveTasks;
