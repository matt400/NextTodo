import { useState } from 'react';
import { Pencil, Trash2, CirclePlus } from 'lucide-react';
import EditTaskModal from './EditTaskModal';
import '../../styles/elements/todo-item.css';

const TodoItem = ({ task, onToggle, onDelete, onEdit }) => {
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	return (
		<>
			<div className='todo-item'>
				<div
					className={`todo-checkbox ${task.done ? 'checked' : ''}`}
					onClick={() => onToggle(task.id)}>
					{task.done && <span className='checkmark'>✓</span>}
				</div>

				<p className={`todo-text ${task.done ? 'done' : ''}`}>{task.text}</p>

				<div className='todo-actions desktop'>
					<Pencil
						className='todo-btn'
						size={20}
						style={{ color: 'var(--color-dark-2)' }}
						onClick={() => setShowEditModal(true)}
					/>

					<Trash2
						className='todo-btn'
						size={20}
						style={{ color: 'var(--color-dark-2)' }}
						onClick={() => onDelete(task.id)}
					/>
				</div>

				<div className='todo-actions mobile'>
					<CirclePlus
						className='todo-btn'
						size={20}
						style={{ color: 'var(--color-dark-2)' }}
						onClick={() => setShowModal(true)}
					/>
				</div>
			</div>

			{showModal && (
				<div className='todo-modal'>
					<button onClick={() => onEdit(task.id)}>
						<Pencil
							className='todo-btn'
							size={20}
							style={{ color: 'var(--color-dark-2)' }}
						/>{' '}
						Edit
					</button>
					<button onClick={() => onDelete(task.id)}>
						<Trash2
							className='todo-btn'
							style={{ color: 'var(--color-dark-2)' }}
							size={20}
						/>{' '}
						Delete
					</button>
					<button onClick={() => setShowModal(false)}>Close</button>
				</div>
			)}
			{showEditModal && (
				<EditTaskModal
					task={task}
					onUpdate={onEdit}
					onClose={() => setShowEditModal(false)}
				/>
			)}
		</>
	);
};

export default TodoItem;
