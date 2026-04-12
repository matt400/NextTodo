import { useEffect, useState } from 'react';
import {
	fetchTasks,
	addTask as apiAddTask,
	editTask as apiEditTask,
	deleteTask as apiDeleteTask,
} from '../../api/taskApi';

import ToDoItem from '../ToDoItem';
import CreateTaskButton from '../CreateTaskButton';
import AddTaskModal from '../AddTaskModal';
import DeleteAllButton from '../DeleteAllButton';
import DeleteAllModal from './DeleteAllModal';
import Loader from '../Loader';

import { Plus, Search } from 'lucide-react';

import styles from './ActiveTasks.module.css';

const ActiveTasks = ({ activePomodoroId, setActivePomodoroId, activePomoData, setActivePomoData }) => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const activeTasks = tasks.filter((task) => !task.done);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const loadTasks = async () => {
		setLoading(true);
		try {
			const data = await fetchTasks();
			setTasks(data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const data = await fetchTasks();
				setTasks(data);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const addTask = async ({ title, description }) => {
		try {
			await apiAddTask(title, description);
		} finally {
			await loadTasks();
		}
	};

	const toggleTask = async (id) => {
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		try {
			await apiEditTask(id, { isFinished: !task.done });
		} finally {
			await loadTasks();
		}
	};

	const deleteTask = async (id) => {
		try {
			await apiDeleteTask(id);
		} finally {
			await loadTasks();
		}
	};

	const updateTask = async (id, data) => {
		try {
			await apiEditTask(id, data);
		} finally {
			await loadTasks();
		}
	};

	const handleConfirmDeleteAll = async () => {
		try {
			await Promise.all(activeTasks.map((task) => apiDeleteTask(task.id)));
			setShowDeleteModal(false);
		} finally {
			await loadTasks();
		}
	};

	return (
		<div className={styles.container}>
			{loading && <Loader />}

			{activeTasks.length > 0 && (
				<div className={styles.activeHeader}>
					<h2 className={styles.activeTasksCount}>Active tasks ({activeTasks.length})</h2>
					<DeleteAllButton onClick={() => setShowDeleteModal(true)} />
				</div>
			)}

			<div className={styles.tasksList}>
				{activeTasks.length === 0 ? (
					<div className={styles.emptyState}>
						<div className={styles.emptyContainer}>
							<Search size={68} />
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
							activePomoData={activePomoData}
							setActivePomoData={setActivePomoData}
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

			{showDeleteModal && (
				<DeleteAllModal type='active' onConfirm={handleConfirmDeleteAll} onCancel={() => setShowDeleteModal(false)} />
			)}
		</div>
	);
};

export default ActiveTasks;
