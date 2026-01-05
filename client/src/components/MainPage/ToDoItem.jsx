import { useState } from 'react';
import EditTaskModal from './EditTaskModal';
import { Pencil, Trash2, CirclePlus, Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '../../styles/elements/todo-item.css';

const TodoItem = ({ task, onToggle, onDelete, onEdit }) => {
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [dueDate, setDueDate] = useState(null);
	const openCalendar = () => {
		setShowModal(false);
		setShowCalendarModal(true);
	};
	const isToday =
		dueDate && new Date(dueDate).toDateString() === new Date().toDateString();

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
					{dueDate && (
						<span className={`todo-date ${isToday ? 'todo-date--today' : ''}`}>
							{dueDate.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit',
							})}
						</span>
					)}

					<button
						className='todo-action-btn calendar-btn'
						onClick={() => setShowCalendarModal(true)}>
						<Calendar
							size={20}
							style={{ color: 'var(--color-primary-hover)' }}
						/>
					</button>
					<button
						className='todo-action-btn'
						onClick={() => setShowEditModal(true)}>
						<Pencil size={20} />
					</button>

					<button
						className='todo-action-btn delete-btn'
						onClick={() => onDelete(task.id)}>
						<Trash2 size={20} style={{ color: 'var(--color-red)' }} />
					</button>
				</div>

				<div className='todo-actions mobile'>
					{dueDate && (
						<span className={`todo-date ${isToday ? 'todo-date--today' : ''}`}>
							{dueDate.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit',
							})}
						</span>
					)}

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
					<button onClick={openCalendar}>
						<Calendar
							className='todo-btn'
							size={20}
							style={{ color: 'var(--color-dark-2)' }}
						/>
						Set Date
					</button>
					<button onClick={() => setShowEditModal(true)}>
						<Pencil
							className='todo-btn'
							size={20}
							style={{ color: 'var(--color-dark-2)' }}
						/>{' '}
						Edit Task
					</button>
					<button onClick={() => onDelete(task.id)}>
						<Trash2
							className='todo-btn'
							style={{ color: 'var(--color-dark-2)' }}
							size={20}
						/>{' '}
						Delete Task
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
			{showCalendarModal && (
				<div className='calendar-modal'>
					<div className='calendar-header'>
						<button
							className='calendar-close-btn'
							onClick={() => setShowCalendarModal(false)}>
							✕
						</button>
					</div>

					<DayPicker
						mode='single'
						selected={dueDate}
						onSelect={(date) => setDueDate(date)}
					/>

					<div className='calendar-footer'>
						<button
							className='calendar-footer-btn delete'
							onClick={() => {
								setDueDate(null);
								setShowCalendarModal(false);
							}}>
							Cancel
						</button>

						<button
							className='calendar-footer-btn create'
							onClick={() => setShowCalendarModal(false)}>
							Set Date
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default TodoItem;
