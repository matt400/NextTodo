import { useState } from 'react';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { DayPicker } from 'react-day-picker';
import PomodoroTimer from '../PomodoroTimer';
import { startPomodoro, getPomodoro } from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import type { Task, PomoData } from '../../types';

import { Pencil, Trash2, CirclePlus, Calendar, AlarmClock, X, ChevronDown } from 'lucide-react';
import styles from './ToDoItem.module.css';
import 'react-day-picker/dist/style.css';

interface ToDoItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Record<string, unknown>) => void;
  activePomodoroId: number | null;
  setActivePomodoroId: (id: number | null) => void;
  activePomoData: PomoData | null;
  setActivePomoData: (data: PomoData | null) => void;
}

const ToDoItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  activePomodoroId,
  setActivePomodoroId,
  activePomoData,
  setActivePomoData,
}: ToDoItemProps) => {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const effectiveDueDate = dueDate ?? (task.scheduled ? new Date(task.scheduled) : null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const isToday = (() => {
    if (!effectiveDueDate) return false;
    const due = new Date(effectiveDueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === todayStart.getTime();
  })();

  const isPast = (() => {
    if (!effectiveDueDate) return false;
    const due = new Date(effectiveDueDate);
    due.setHours(0, 0, 0, 0);
    return due < todayStart;
  })();

  const handleStartPomodoro = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const minutes = user?.settings?.pomodoroTime || 25;
    await startPomodoro(task.id, minutes);
    const data = await getPomodoro(task.id);

    if (data) {
      setActivePomodoroId(task.id);
      setActivePomoData(data);
    }
  };

  return (
    <>
      <div
        className={`${styles['todoItem']} ${isExpanded ? styles.expanded : ''} ${task.description ? styles.clickable : ''}`}
        onClick={() => {
          if (!task.description) return;
          setIsExpanded((prev) => !prev);
        }}>
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
              <ChevronDown
                size={16}
                className={`${styles['expandArrow']} ${isExpanded ? styles.rotated : ''}`}
              />
            )}
          </p>

          <div className={styles['todoIndicators']}>
            <PomodoroTimer
              taskId={task.id}
              activePomodoroId={activePomodoroId}
              setActivePomodoroId={setActivePomodoroId}
              activePomoData={activePomoData}
              setActivePomoData={setActivePomoData}
            />

            {effectiveDueDate && (
              <div
                className={`${styles['todoDate']} ${isToday ? styles['todoDate--today'] : ''} ${isPast ? styles['todoDate--past'] : ''} ${styles['todoDate--clickable']}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendarModal(true);
                }}>
                {new Date(effectiveDueDate).toLocaleDateString('en-US', {
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
                    onClick={handleStartPomodoro}>
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

        <div className={`${styles['descriptionWrapper']} ${isExpanded ? styles.open : ''}`}>
          <div className={`${styles['todoDescriptionExpanded']} ${task.done ? styles.done : ''}`}>
            {task.description}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onUpdate={(id, updates) => onEdit(id, updates)}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showCalendarModal && (
        <div className={styles['calendarOverlay']} onClick={() => setShowCalendarModal(false)}>
          <div className={styles['calendarModal']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['calendarHeader']}>
              <button className={styles['calendarCloseBtn']} onClick={() => setShowCalendarModal(false)}>
                ✕
              </button>
            </div>

            <DayPicker
              mode='single'
              selected={effectiveDueDate ?? undefined}
              onSelect={(date) => setDueDate(date ?? null)}
              disabled={{ before: todayStart }}
              classNames={{
                day: styles.day,
              }}
              modifiersClassNames={{
                disabled: styles.dayDisabled,
              }}
            />

            <div className={styles['calendarFooter']}>
              <button
                className={`${styles['calendarFooterBtn']} ${styles.deleteCalendar}`}
                onClick={async () => {
                  setDueDate(null);
                  await onEdit(task.id, { scheduled: null });
                  setShowCalendarModal(false);
                }}>
                Cancel
              </button>

              <button
                className={`${styles['calendarFooterBtn']} ${styles.create}`}
                disabled={isPast}
                onClick={async () => {
                  await onEdit(task.id, {
                    scheduled: effectiveDueDate ? effectiveDueDate.toISOString() : null,
                  });
                  setShowCalendarModal(false);
                }}>
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
                  setShowMobileActions(false);
                  handleStartPomodoro(e);
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
