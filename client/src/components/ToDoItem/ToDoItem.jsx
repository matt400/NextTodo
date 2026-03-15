import { useState } from 'react';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { DayPicker } from 'react-day-picker';
import PomodoroTimer from '../PomodoroTimer';

import { Pencil, Trash2, CirclePlus, Calendar, AlarmClock, X, ChevronDown } from 'lucide-react';
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

	return (
		<>
			<div
				className={`${styles['todoItem']} ${isExpanded ? styles.expanded : ''}`}
				onClick={() => setIsExpanded((prev) => !prev)}>
				<div className={styles['todoMainRow']}>
					<div
						className={`${styles['todoCheckbox']} ${task.done ? styles.checked : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							if (activePomodoroId === task.id) {
								setActivePomodoroId(null);
							}
							onToggle(task.id);
						}}>
						{task.done && <span className={styles.checkmark}>✓</span>}
					</div>

					<p className={`${styles['todoText']} ${task.done ? styles.done : ''}`}>
						{task.title}

						{task.description && (
							<ChevronDown size={16} className={`${styles['expandArrow']} ${isExpanded ? styles.rotated : ''}`} />
						)}
					</p>

					<div className={styles['todoIndicators']}>
						<PomodoroTimer
							taskId={task.id}
							activePomodoroId={activePomodoroId}
							setActivePomodoroId={setActivePomodoroId}
						/>

						{dueDate && (
							<div className={`${styles['todoDate']} ${isToday ? styles['todoDate--today'] : ''}`}>
								{new Date(dueDate).toLocaleDateString('pl-PL', {
									day: 'numeric',
									month: 'short',
								})}
							</div>
						)}
					</div>

					<div className={styles['todoActionsHover']} onClick={(e) => e.stopPropagation()}>
						{!task.done && (
							<>
								{activePomodoroId === null && (
									<button
										className={`${styles['todoActionBtn']} ${styles['pomodoroBtn']}`}
										onClick={(e) => {
											e.stopPropagation();
											setActivePomodoroId(task.id);
										}}>
										<AlarmClock size={18} />
									</button>
								)}

								<button
									className={`${styles['todoActionBtn']} ${styles['calendarBtn']}`}
									onClick={() => setShowCalendarModal(true)}>
									<Calendar size={18} />
								</button>

								<button
									className={`${styles['todoActionBtn']} ${styles['editBtn']}`}
									onClick={() => setShowEditModal(true)}>
									<Pencil size={18} />
								</button>
							</>
						)}

						<button
							className={`${styles['todoActionBtn']} ${styles['deleteBtn']}`}
							onClick={() => {
								if (activePomodoroId === task.id) {
									setActivePomodoroId(null);
								}
								onDelete(task.id);
							}}>
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
					<div className={styles['todoDescriptionExpanded']}>{task.description}</div>
				)}
			</div>

			{showEditModal && <EditTaskModal task={task} onUpdate={onEdit} onClose={() => setShowEditModal(false)} />}

			{showCalendarModal && (
				<div className={styles['calendarOverlay']} onClick={() => setShowCalendarModal(false)}>
					<div className={styles['calendarModal']} onClick={(e) => e.stopPropagation()}>
						<div className={styles['calendarHeader']}>
							<button className={styles['calendarCloseBtn']} onClick={() => setShowCalendarModal(false)}>
								✕
							</button>
						</div>

						<DayPicker mode='single' selected={dueDate} onSelect={(date) => setDueDate(date)} />

						<div className={styles['calendarFooter']}>
							<button
								className={`${styles['calendarFooterBtn']} ${styles.delete}`}
								onClick={() => {
									setDueDate(null);
									setShowCalendarModal(false);
								}}>
								Cancel
							</button>

							<button
								className={`${styles['calendarFooterBtn']} ${styles.create}`}
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
						{activePomodoroId === null && (
							<button
								className={`${styles['todoActionBtn']} ${styles['pomodoroBtn']}`}
								onClick={(e) => {
									e.stopPropagation();
									setActivePomodoroId(task.id);
								}}>
								<AlarmClock size={18} /> Pomodoro
							</button>
						)}

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
								if (activePomodoroId === task.id) {
									setActivePomodoroId(null);
								}
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
		</>
	);
};

export default ToDoItem;
