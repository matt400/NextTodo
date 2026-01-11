import { useState, useEffect, useRef } from 'react';
import EditTaskModal from './EditTaskModal';
import {
	Pencil,
	Trash2,
	CirclePlus,
	Calendar,
	AlarmClock,
	Play,
	Pause,
	X,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '../../styles/elements/todo-item.css';

const TodoItem = ({
	task,
	onToggle,
	onDelete,
	onEdit,
	activePomodoroId,
	setActivePomodoroId,
}) => {
	const formatTime = (total) => {
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};
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
	const togglePomodoro = () => {
		if (activePomodoroId === task.id) {
			setActivePomodoroId(null);
			setSeconds(0);
			setIsPaused(false);
		} else {
			setActivePomodoroId(task.id);
			setSeconds(0);
			setIsPaused(false);
		}
	};
	useEffect(() => {
		if (activePomodoroId !== task.id) {
			setSeconds(0);
			setIsPaused(false);
		}
	}, [activePomodoroId]);

	const showPomodoro = activePomodoroId === task.id;
	const [seconds, setSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	useEffect(() => {
		if (!showPomodoro || isPaused) return;

		const interval = setInterval(() => {
			setSeconds((prev) => {
				if (prev >= 10) {
					clearInterval(interval);

					setShowAlarm(true);

					if (audioRef.current) {
						audioRef.current.currentTime = 0;
						audioRef.current.play();
					}

					return prev;
				}

				return prev + 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [showPomodoro, isPaused]);

	const togglePomodoroPause = () => {
		setIsPaused((prev) => !prev);
	};
	const [showAlarm, setShowAlarm] = useState(false);
	const audioRef = useRef(null);

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
					{showPomodoro && (
						<button className='pomodoro-alarm' onClick={togglePomodoroPause}>
							{isPaused ? <Play size={20} /> : <Pause size={20} />}
							<p
								className='pomodoro-time'
								style={{ color: 'var(--color-red)' }}>
								{formatTime(seconds)}
							</p>
						</button>
					)}

					{dueDate && (
						<span className={`todo-date ${isToday ? 'todo-date--today' : ''}`}>
							{dueDate.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit',
							})}
						</span>
					)}

					{!task.done && (
						<>
							{(activePomodoroId === null || activePomodoroId === task.id) && (
								<button
									className='todo-action-btn pomodoro-btn'
									onClick={togglePomodoro}>
									<AlarmClock size={20} style={{ color: 'var(--color-red)' }} />
								</button>
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
								className='todo-action-btn edit-btn'
								onClick={() => setShowEditModal(true)}>
								<Pencil size={20} />
							</button>
						</>
					)}

					<button
						className='todo-action-btn delete-btn'
						onClick={() => onDelete(task.id)}>
						<Trash2 size={20} />
					</button>
				</div>

				<div className='todo-actions mobile'>
					{showPomodoro && (
						<button className='pomodoro-alarm' onClick={togglePomodoroPause}>
							{isPaused ? <Play size={18} /> : <Pause size={18} />}
							<p
								className='pomodoro-time'
								style={{ color: 'var(--color-red)' }}>
								{formatTime(seconds)}
							</p>
						</button>
					)}
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

			{showAlarm && (
				<div className='alarm-modal'>
					<div className='alarm-header'>
						<h3>Take a break</h3>
						<AlarmClock />
					</div>
					<div className='alarm-content'>
						<button
							className='ok-button'
							onClick={() => {
								setShowAlarm(false);
								setActivePomodoroId(null);
								setSeconds(0);
								setIsPaused(false);

								if (audioRef.current) {
									audioRef.current.pause();
									audioRef.current.currentTime = 0;
								}
							}}>
							OK
						</button>
					</div>
				</div>
			)}

			{showModal && (
				<div className='todo-modal'>
					{!task.done && (
						<>
							<button className='todo-btn' onClick={togglePomodoro}>
								<AlarmClock size={20} /> Start Pomodoro
							</button>

							<button onClick={openCalendar} className='todo-btn'>
								<Calendar size={20} /> Set Date
							</button>

							<button
								onClick={() => setShowEditModal(true)}
								className='todo-btn'>
								<Pencil size={20} /> Edit Task
							</button>
						</>
					)}

					<button onClick={() => onDelete(task.id)} className='todo-btn'>
						<Trash2 size={20} /> Delete Task
					</button>

					<button onClick={() => setShowModal(false)} className='todo-btn'>
						<X size={20} /> Close
					</button>
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
			<audio ref={audioRef} src='/alarm-clock-beep.wav' loop />
		</>
	);
};

export default TodoItem;
