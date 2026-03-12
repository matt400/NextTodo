import { useEffect, useState } from 'react';
import { fetchTasks, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../../api/taskApi';

import ToDoItem from '../ToDoItem';
import DeleteAllButton from '../DeleteAllButton';
import Loader from '../Loader';

import { Check } from 'lucide-react';
import styles from './CompletedTasks.module.css';

const CompletedTasks = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);

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

	const completedTasks = tasks.filter((task) => task.done);

	const toggleTask = async (id) => {
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		await apiUpdateTask(id, { isFinished: !task.done });
		await loadTasks();
	};

	const deleteTask = async (id) => {
		await apiDeleteTask(id);
		await loadTasks();
	};

	const updateTask = async (id, updates) => {
		await apiUpdateTask(id, updates);
		await loadTasks();
	};

	const deleteAllCompleted = async () => {
		const confirmed = window.confirm('Delete all completed tasks?');
		if (!confirmed) return;

		await Promise.all(completedTasks.map((task) => apiDeleteTask(task.id)));

		await loadTasks();
	};

	return (
		<div className={styles.container}>
			{loading && <Loader />}

			{completedTasks.length > 0 && (
				<div className={styles.activeHeader}>
					<h2 className={styles.activeTasksCount}>Completed tasks ({completedTasks.length})</h2>
					<DeleteAllButton onClick={deleteAllCompleted} />
				</div>
			)}

			<div className={styles.tasksList}>
				{completedTasks.length === 0 ? (
					<div className={styles.emptyState}>
						<div className={styles.emptyContainer}>
							<Check size={48} />
							<h3>Nothing completed yet</h3>
							<p>Your finished tasks will appear here</p>
						</div>
					</div>
				) : (
					completedTasks.map((task) => (
						<ToDoItem
							key={task.id}
							task={task}
							onToggle={toggleTask}
							onDelete={deleteTask}
							onEdit={updateTask}
							activePomodoroId={null}
							setActivePomodoroId={() => {}}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default CompletedTasks;
