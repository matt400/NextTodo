import { useState, useEffect, useRef } from 'react';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { Pencil, Trash2, CirclePlus, Calendar, AlarmClock, Play, Pause, X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './ToDoItem.module.css';

const TodoItem = ({ task, onToggle, onDelete, onEdit, activePomodoroId, setActivePomodoroId }) => {
	console.log('onDelete:', onDelete);

	const formatTime = (total) => {
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [dueDate, setDueDate] = useState(null);
	const [showAlarm, setShowAlarm] = useState(false);
	const showPomodoro = activePomodoroId === task.id;
	const [seconds, setSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const audioRef = useRef(null);
	const isToday = dueDate && new Date(dueDate).toDateString() === new Date().toDateString();

	const openCalendar = () => {
		setShowModal(false);
		setShowCalendarModal(true);
	};
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

	return (
		<>
			<div className={styles['todo-item']}>
				<div
					className={`${styles['todo-checkbox']} ${task.done ? styles.checked : ''}`}
					onClick={() => onToggle(task.id)}>
					{task.done && <span className={styles.checkmark}>✓</span>}
				</div>

				<p className={`${styles['todo-text']} ${task.done ? styles.done : ''}`}>{task.title}</p>
				<p className={styles['todo-description']}>{task.description}</p>

				<div className={`${styles['todo-actions']} ${styles.desktop}`}>
					{showPomodoro && (
						<button className={styles['pomodoro-alarm']} onClick={togglePomodoroPause}>
							{isPaused ? <Play size={20} /> : <Pause size={20} />}
							<p className={styles['pomodoro-time']}>{formatTime(seconds)}</p>
						</button>
					)}

					{dueDate && (
						<span className={`${styles['todo-date']} ${isToday ? styles['todo-date--today'] : ''}`}>
							{dueDate.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit',
							})}
						</span>
					)}

					{!task.done && (
						<>
							{(activePomodoroId === null || activePomodoroId === task.id) && (
								<button className={`${styles['todo-action-btn']} ${styles['pomodoro-btn']}`} onClick={togglePomodoro}>
									<AlarmClock size={20} />
								</button>
							)}

							<button
								className={`${styles['todo-action-btn']} ${styles['calendar-btn']}`}
								onClick={() => setShowCalendarModal(true)}>
								<Calendar size={20} />
							</button>

							<button
								className={`${styles['todo-action-btn']} ${styles['edit-btn']}`}
								onClick={() => setShowEditModal(true)}>
								<Pencil size={20} />
							</button>
						</>
					)}

					<button className={`${styles['todo-action-btn']} ${styles['delete-btn']}`} onClick={() => onDelete(task.id)}>
						<Trash2 size={20} />
					</button>
				</div>

				<div className={`${styles['todo-actions']} ${styles.mobile}`}>
					{showPomodoro && (
						<button className={styles['pomodoro-alarm']} onClick={togglePomodoroPause}>
							{isPaused ? <Play size={18} /> : <Pause size={18} />}
							<p className={styles['pomodoro-time']}>{formatTime(seconds)}</p>
						</button>
					)}

					{dueDate && (
						<span className={`${styles['todo-date']} ${isToday ? styles['todo-date--today'] : ''}`}>
							{dueDate.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit',
							})}
						</span>
					)}

					<CirclePlus className={styles['todo-btn']} size={20} onClick={() => setShowModal(true)} />
				</div>
			</div>

			{showAlarm && (
				<div className={styles['alarm-modal']}>
					<div className={styles['alarm-header']}>
						<h3>Take a break</h3>
						<AlarmClock />
					</div>
					<div className={styles['alarm-content']}>
						<button
							className={styles['ok-button']}
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
				<div className={styles['todo-modal']}>
					{!task.done && (
						<>
							<button className={styles['todo-btn']} onClick={togglePomodoro}>
								<AlarmClock size={20} /> Start Pomodoro
							</button>

							<button onClick={openCalendar} className={styles['todo-btn']}>
								<Calendar size={20} /> Set Date
							</button>

							<button onClick={() => setShowEditModal(true)} className={styles['todo-btn']}>
								<Pencil size={20} /> Edit Task
							</button>
						</>
					)}

					<button onClick={() => onDelete(task.id)} className={styles['todo-btn']}>
						<Trash2 size={20} /> Delete Task
					</button>

					<button onClick={() => setShowModal(false)} className={styles['todo-btn']}>
						<X size={20} /> Close
					</button>
				</div>
			)}

			{showEditModal && <EditTaskModal task={task} onUpdate={onEdit} onClose={() => setShowEditModal(false)} />}

			{showCalendarModal && (
				<div className={styles['calendar-modal']}>
					<div className={styles['calendar-header']}>
						<button className={styles['calendar-close-btn']} onClick={() => setShowCalendarModal(false)}>
							✕
						</button>
					</div>

					<DayPicker mode='single' selected={dueDate} onSelect={(date) => setDueDate(date)} />

					<div className={styles['calendar-footer']}>
						<button
							className={`${styles['calendar-footer-btn']} ${styles.delete}`}
							onClick={() => {
								setDueDate(null);
								setShowCalendarModal(false);
							}}>
							Cancel
						</button>

						<button
							className={`${styles['calendar-footer-btn']} ${styles.create}`}
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
