import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { History, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { fetchPomoHistory, deletePomoRecord } from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import type { PomoRecord } from '../../types';
import styles from './PomodoroHistory.module.css';

const PANEL_WIDTH = 280;
const MARGIN = 8;

const formatDuration = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
};

const formatTime = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const PomodoroHistory = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<PomoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: -9999, left: -9999 });
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnRectRef = useRef<DOMRect | null>(null);

  const pomodoroMinutes = Number(user?.settings?.pomodoroTime) || 25;

  useEffect(() => {
    if (!open) return;
    fetchPomoHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current || window.innerWidth < 768) return;
    const rect = btnRectRef.current;
    if (!rect) return;

    const panelHeight = panelRef.current.getBoundingClientRect().height;
    let top = rect.top - panelHeight - MARGIN;
    let left = rect.right - PANEL_WIDTH;

    if (top < MARGIN) top = rect.bottom + MARGIN;
    if (left < MARGIN) left = MARGIN;
    if (left + PANEL_WIDTH > window.innerWidth - MARGIN) left = window.innerWidth - PANEL_WIDTH - MARGIN;
    if (top + panelHeight > window.innerHeight - MARGIN) top = window.innerHeight - panelHeight - MARGIN;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPanelPos({ top, left });
  }, [open]);

  const handleDelete = async (e: React.MouseEvent, pomoId: number) => {
    e.stopPropagation();
    await deletePomoRecord(pomoId);
    setHistory((prev) => prev.filter((p) => p.id !== pomoId));
  };

  return (
    <div className={styles.wrapper}>
      <button
        ref={btnRef}
        className={styles.historyBtn}
        onClick={(e) => {
          e.stopPropagation();
          if (!open) {
            if (window.innerWidth >= 768 && btnRef.current) {
              btnRectRef.current = btnRef.current.getBoundingClientRect();
            }
            setPanelPos({ top: -9999, left: -9999 });
            setLoading(true);
          }
          setOpen((prev) => !prev);
        }}
        title='Pomodoro history'>
        <History size={16} />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            style={window.innerWidth >= 768 ? { top: panelPos.top, left: panelPos.left } : undefined}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <span>Pomodoro history</span>
              <span className={styles.settingTime}>
                <Clock size={12} />
                {pomodoroMinutes}m set
              </span>
            </div>

            {loading && <p className={styles.empty}>Loading…</p>}

            {!loading && history.length === 0 && <p className={styles.empty}>No pomodoros yet</p>}

            {!loading && history.length > 0 && (
              <ul className={styles.list}>
                {history.map((p) => {
                  const completed = p.elapsed >= p.duration * 1000;
                  const spentSec = Math.floor(p.elapsed / 1000);
                  const durationSec = p.duration;

                  return (
                    <li key={p.id} className={styles.entry}>
                      <div className={styles.entryTop}>
                        <span className={styles.taskName}>{p.taskName}</span>
                        <div className={styles.entryTopRight}>
                          {completed ? (
                            <CheckCircle size={14} className={styles.iconDone} />
                          ) : (
                            <XCircle size={14} className={styles.iconInterrupted} />
                          )}
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) => handleDelete(e, p.id)}
                            title='Remove'>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.entryMeta}>
                        <span
                          className={`${styles.badge} ${completed ? styles.badgeDone : styles.badgeInterrupted}`}>
                          {completed ? 'Completed' : 'Interrupted'}
                        </span>
                        <span className={styles.times}>
                          {formatDuration(spentSec)}
                          <span className={styles.sep}>/</span>
                          {formatDuration(durationSec)}
                        </span>
                        <span className={styles.date}>
                          {formatDate(p.startedAt)} {formatTime(p.startedAt)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default PomodoroHistory;
