import { useState } from 'react';
import styles from './MainPage.module.css';
import Navbar from '../Navbar/Navbar';
import CreateTaskButton from './CreateTaskButton/CreateTaskButton';
import EmptyState from './EmptyState/EmptyState';
import ActiveState from './ActiveState/ActiveState';
import CompletedState from './CompletedState/CompletedState';
import AddTaskModal from './AddTaskModal/AddTaskModal';
import { Plus } from 'lucide-react';

const MainPage = () => {
	const [tasks, setTasks] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const activeTasks = tasks.filter((t) => !t.done);
	const completedTasks = tasks.filter((t) => t.done);
	const [activePomodoroId, setActivePomodoroId] = useState(null);

	const addTask = (text) => {
		const nextId =
			tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
		const newTask = { id: nextId, text, done: false };
		setTasks((prev) => [...prev, newTask]);
		setShowCreateModal(false);
	};

	const updateTask = (id, newText) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
		);
	};

	const toggleTask = (id) => {
		setTasks((prev) =>
			prev.map((t) => {
				if (t.id === id && !t.done) {
					setActivePomodoroId(null);
				}
				return t.id === id ? { ...t, done: !t.done } : t;
			})
		);
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
							setTasks={setTasks}
							onEdit={updateTask}
							onToggle={toggleTask}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>
					)}

					{completedTasks.length > 0 && (
						<CompletedState
							tasks={completedTasks}
							setTasks={setTasks}
							onEdit={updateTask}
							onToggle={toggleTask}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>
					)}
				</div>
				{showCreateModal && (
					<AddTaskModal
						onAdd={addTask}
						onClose={() => setShowCreateModal(false)}
					/>
				)}
			</div>
		</>
	);
};

export default MainPage;
