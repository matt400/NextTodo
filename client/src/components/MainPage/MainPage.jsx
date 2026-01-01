import { useState } from 'react';
import '../MainPage/MainPage.css';
import Navbar from '../Navbar';
import CreateTaskButton from './CreateTaskButton';
import EmptyState from './EmptyState';
import ActiveState from './ActiveState';
import CompletedState from './CompletedState';
import AddTaskModal from './AddTaskModal';
import { Plus } from 'lucide-react';

const MainPage = () => {
	const [tasks, setTasks] = useState([]);

	const [showCreateModal, setShowCreateModal] = useState(false);
	const activeTasks = tasks.filter((t) => !t.done);
	const completedTasks = tasks.filter((t) => t.done);

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

	return (
		<>
			<Navbar title='My Tasks' showBack={false} showSettings={true} />

			<div className='main-content'>
				<CreateTaskButton
					onClick={() => setShowCreateModal(true)}
					inner={
						<>
							<Plus size={15} />
							Add New Task
						</>
					}
				/>

				<div className='todo-container'>
					{activeTasks.length === 0 && <EmptyState />}
					{activeTasks.length > 0 && (
						<ActiveState tasks={activeTasks} setTasks={setTasks} onEdit={updateTask}/>
					)}

					{completedTasks.length > 0 && (
						<CompletedState tasks={completedTasks} setTasks={setTasks} onEdit={updateTask} />
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
