import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../api/auth';
import { fetchTasks, addTask as apiAddTask, updateTask as apiUpdateTask } from '../../api/taskApi';

import Navbar from '../Navbar/Navbar';
import CreateTaskButton from './CreateTaskButton/CreateTaskButton';
import EmptyState from './EmptyState/EmptyState';
import ActiveState from './ActiveState/ActiveState';
import CompletedState from './CompletedState/CompletedState';
import AddTaskModal from './AddTaskModal/AddTaskModal';

import styles from './MainPage.module.css';
import { Plus } from 'lucide-react';

const MainPage = () => {

	///////////////////HOOKS///////////////////////

	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const activeTasks = tasks.filter((t) => !t.done);
	const completedTasks = tasks.filter((t) => t.done);
	const [activePomodoroId, setActivePomodoroId] = useState(null);

	///////////////////API///////////////////////

	useEffect(() => {
		getMe().then((u) => {
			if (!u) {
				navigate('/login');
			} else {
				setUser(u);
			}
		});
	}, []);

	const loadTasks = async () => {
		const data = await fetchTasks();
		setTasks(data);
	};
	useEffect(() => {
		if (user) {
			loadTasks();
		}
	}, [user]);

	///////////////////TASK LOGIC///////////////////////

	const addTask = async ({ title, description }) => {
		await apiAddTask(title, description);
		await loadTasks();
		setShowCreateModal(false);
	};

	const updateTask = async (id, updates) => {
		await apiUpdateTask(id, updates);
		await loadTasks();
	};

	const toggleTask = async (id) => {
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		if (!task.done) {
			setActivePomodoroId(null);
		}

		await apiUpdateTask(id, { isFinished: !task.done });
		await loadTasks();
	};

	const handleDelete = async (id) => {
		try {
			if (activePomodoroId === id) {
				setActivePomodoroId(null);
			}

			await fetch('/api/task/remove', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					task_id: [id],
				}),
			});

			setTasks((prev) => prev.filter((task) => task.id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<Navbar title='My Tasks' showBack={false} showSettings={true} />

			<div className={`${styles.mainContent}`}>
				<CreateTaskButton
					onClick={() => setShowCreateModal(true)}
					inner={
						<>
							<Plus size={15} />
							Add New Task
						</>
					}
				/>

				<div className={`${styles.todoContainer}`}>
					{activeTasks.length === 0 && <EmptyState />}
					{activeTasks.length > 0 && (
						<ActiveState
							tasks={activeTasks}
							onEdit={updateTask}
							onToggle={toggleTask}
							onDelete={handleDelete}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>
					)}

					{completedTasks.length > 0 && (
						<CompletedState
							tasks={completedTasks}
							setTasks={setTasks}
							onEdit={updateTask}
							onDelete={handleDelete}
							onToggle={toggleTask}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>
					)}
				</div>
				{showCreateModal && <AddTaskModal onAdd={addTask} onClose={() => setShowCreateModal(false)} />}
			</div>
		</>
	);
};

export default MainPage;
