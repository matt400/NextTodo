import { useState, useEffect, useRef } from 'react';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { DayPicker } from 'react-day-picker';

import { Pencil, Trash2, CirclePlus, Calendar, AlarmClock, Play, Pause, X, ChevronDown } from 'lucide-react';
import styles from './ToDoItem.module.css';
import 'react-day-picker/dist/style.css';

const ToDoItem = ({ task, onToggle, onDelete, onEdit, activePomodoroId, setActivePomodoroId }) => {
	// MODALS & EXPANSIONS

	const [isExpanded, setIsExpanded] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showMobileActions, setShowMobileActions] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	//CALENDAR VARIABLES & FUNCTION

	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [dueDate, setDueDate] = useState(null);
	const isToday = dueDate && new Date(dueDate).toDateString() === new Date().toDateString();
	const openCalendar = () => {
		setShowModal(false);
		setShowCalendarModal(true);
	};

	// POMODORO VARIABLES & FUNCTIONS

	const [pomodoroMinutes, setPomodoroMinutes] = useState(Number(localStorage.getItem('pomodoroTime')) || 25);
	const POMODORO_TIME = pomodoroMinutes * 60;
	const [newPomodoroTime, setNewPomodoroTime] = useState(25);
	const showPomodoro = activePomodoroId === task.id;
	const [showAlarm, setShowAlarm] = useState(false);
	const [seconds, setSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const formatTime = (total) => {
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
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
	const togglePomodoroPause = () => {
		setIsPaused((prev) => !prev);
	};
	const audioRef = useRef(null);

	// useEffects for POMODORO

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
				if (prev >= POMODORO_TIME) {
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
	}, [showPomodoro, isPaused, POMODORO_TIME]);

	useEffect(() => {
		const handler = () => {
			const stored = Number(localStorage.getItem('pomodoroTime'));
			if (stored) setPomodoroMinutes(stored);
		};

		window.addEventListener('pomodoroUpdate', handler);

		return () => window.removeEventListener('pomodoroUpdate', handler);
	}, []);

	return (
		<>
			<div
				className={`${styles['todo-item']} ${isExpanded ? styles.expanded : ''}`}
				onClick={() => setIsExpanded((prev) => !prev)}>
				<div className={styles['todo-main-row']}>
					<div
						className={`${styles['todo-checkbox']} ${task.done ? styles.checked : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							onToggle(task.id);
						}}>
						{task.done && <span className={styles.checkmark}>✓</span>}
					</div>

					<p className={`${styles['todo-text']} ${task.done ? styles.done : ''}`}>
						{task.title}

						{task.description && (
							<ChevronDown size={16} className={`${styles['expand-arrow']} ${isExpanded ? styles.rotated : ''}`} />
						)}
					</p>

					<div className={styles['todo-indicators']}>
						{showPomodoro && (
							<div className={styles['pomodoro-alarm']}>
								<span className={styles['pomodoro-time']}>{formatTime(seconds)}</span>

								<button
									className={styles['todo-action-btn']}
									onClick={(e) => {
										e.stopPropagation();
										togglePomodoroPause();
									}}>
									{isPaused ? <Play size={16} /> : <Pause size={16} />}
								</button>

								<button
									className={styles['todo-action-btn']}
									onClick={(e) => {
										e.stopPropagation();
										togglePomodoro();
									}}>
									<X size={16} />
								</button>
							</div>
						)}

						{dueDate && (
							<div className={`${styles['todo-date']} ${isToday ? styles['todo-date--today'] : ''}`}>
								{new Date(dueDate).toLocaleDateString('pl-PL', {
									day: 'numeric',
									month: 'short',
								})}
							</div>
						)}
					</div>

					<div className={styles['todo-actions-hover']} onClick={(e) => e.stopPropagation()}>
						{!task.done && (
							<>
								{activePomodoroId === null && (
									<button
										className={`${styles['todo-action-btn']} ${styles['pomodoro-btn']}`}
										onClick={(e) => {
											e.stopPropagation();
											togglePomodoro();
										}}>
										<AlarmClock size={18} />
									</button>
								)}

								<button
									className={`${styles['todo-action-btn']} ${styles['calendar-btn']}`}
									onClick={() => setShowCalendarModal(true)}>
									<Calendar size={18} />
								</button>

								<button
									className={`${styles['todo-action-btn']} ${styles['edit-btn']}`}
									onClick={() => setShowEditModal(true)}>
									<Pencil size={18} />
								</button>
							</>
						)}

						<button
							className={`${styles['todo-action-btn']} ${styles['delete-btn']}`}
							onClick={() => onDelete(task.id)}>
							<Trash2 size={18} />
						</button>
					</div>

					{!task.done ? (
						<button
							className={styles.mobilePlus}
							onClick={(e) => {
								e.stopPropagation();
								setShowMobileActions(true);
							}}>
							<CirclePlus size={20} />
						</button>
					) : (
						<button
							className={styles.mobilePlus}
							onClick={(e) => {
								e.stopPropagation();
								onDelete(task.id);
							}}>
							<Trash2 size={20} />
						</button>
					)}
				</div>

				{isExpanded && task.description && (
					<div className={styles['todo-description-expanded']}>{task.description}</div>
				)}
			</div>

			{showAlarm && (
				<div className={styles['alarm-overlay']}>
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
				</div>
			)}

			{showEditModal && <EditTaskModal task={task} onUpdate={onEdit} onClose={() => setShowEditModal(false)} />}

			{showCalendarModal && (
				<div className={styles['calendar-overlay']} onClick={() => setShowCalendarModal(false)}>
					<div className={styles['calendar-modal']} onClick={(e) => e.stopPropagation()}>
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
				</div>
			)}

			{showMobileActions && (
				<div className={styles.mobileOverlay} onClick={() => setShowMobileActions(false)}>
					<div className={styles.mobileActionsModal} onClick={(e) => e.stopPropagation()}>
						<button
							onClick={() => {
								setShowMobileActions(false);
								togglePomodoro();
							}}>
							<AlarmClock size={18} /> Pomodoro
						</button>

						<button
							onClick={() => {
								setShowMobileActions(false);
								setShowCalendarModal(true);
							}}>
							<Calendar size={18} /> Calendar
						</button>

						<button
							onClick={() => {
								setShowMobileActions(false);
								setShowEditModal(true);
							}}>
							<Pencil size={18} /> Edit
						</button>

						<button
							onClick={() => {
								setShowMobileActions(false);
								onDelete(task.id);
							}}>
							<Trash2 size={18} /> Delete
						</button>

						<button className={styles.mobileClose} onClick={() => setShowMobileActions(false)}>
							<X size={18} /> Close
						</button>
					</div>
				</div>
			)}

			<audio ref={audioRef} src='/alarm-clock-beep.wav' loop />
		</>
	);
};

export default ToDoItem;
