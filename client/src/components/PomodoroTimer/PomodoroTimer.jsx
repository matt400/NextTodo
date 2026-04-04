import { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, AlarmClock } from 'lucide-react';
import styles from './PomodoroTimer.module.css';
import { pausePomodoro, resumePomodoro, endPomodoro, getPomodoro } from '../../api/taskApi';

const PomodoroTimer = ({ taskId, activePomodoroId, setActivePomodoroId, activePomoData, setActivePomoData }) => {
	const [pomodoroMinutes, setPomodoroMinutes] = useState(Number(localStorage.getItem('pomodoroTime')) || 25);

	const showPomodoro = activePomodoroId === taskId;
	const [seconds, setSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [showAlarm, setShowAlarm] = useState(false);
	const audioRef = useRef(null);
	const initializedRef = useRef(false);

	const formatTime = (total) => {
		const safe = isNaN(total) || total < 0 ? 0 : Math.floor(total);
		const m = Math.floor(safe / 60);
		const s = safe % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	const handleEnd = async () => {
		await endPomodoro(taskId);
		setActivePomodoroId(null);
		setActivePomoData(null);
	};

	const togglePause = async () => {
		const nextPaused = !isPaused;
		setIsPaused(nextPaused);

		if (nextPaused) {
			await pausePomodoro(taskId);
		} else {
			await resumePomodoro(taskId);
		}

		const data = await getPomodoro(taskId);
		if (data) setActivePomoData(data);
	};

	useEffect(() => {
		if (!activePomoData || showAlarm) return;

		const duration = Number(activePomoData.duration) || pomodoroMinutes * 60;
		if (seconds >= duration) {
			setShowAlarm(true);
			if (audioRef.current) {
				audioRef.current.currentTime = 0;
				audioRef.current.play();
			}
		}
	}, [seconds, activePomoData, showAlarm, pomodoroMinutes]);

	useEffect(() => {
		if (!activePomoData || activePomodoroId !== taskId) {
			initializedRef.current = false;
			return;
		}

		const computeSeconds = () => {
			const now = Date.now();
			const elapsedSec = Math.floor(Number(activePomoData.elapsed) / 1000) || 0;

			if (activePomoData.pausedAt) {
				return elapsedSec;
			} else {
				const startedAt = new Date(activePomoData.startedAt).getTime();
				const sinceStart = isNaN(startedAt) ? 0 : Math.floor((now - startedAt) / 1000);
				return elapsedSec + sinceStart;
			}
		};

		if (!initializedRef.current) {
			initializedRef.current = true;
			setIsPaused(!!activePomoData.pausedAt);
			setSeconds(computeSeconds());
		}

		const interval = setInterval(() => {
			const now = Date.now();
			const elapsedSec = Math.floor(Number(activePomoData.elapsed) / 1000) || 0;

			let total;
			if (activePomoData.pausedAt) {
				total = elapsedSec;
				setIsPaused(true);
			} else {
				const startedAt = new Date(activePomoData.startedAt).getTime();
				const sinceStart = isNaN(startedAt) ? 0 : Math.floor((now - startedAt) / 1000);
				total = elapsedSec + sinceStart;
				setIsPaused(false);
			}

			setSeconds(total);
		}, 1000);

		return () => clearInterval(interval);
	}, [activePomoData, activePomodoroId, taskId]);

	useEffect(() => {
		if (activePomodoroId !== taskId) {
			setSeconds(0);
			setIsPaused(false);
		}
	}, [activePomodoroId, taskId]);

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
			{showPomodoro && (
				<div className={styles.pomodoro}>
					<span className={styles.time}>{formatTime(seconds)}</span>

					<button
						className={styles.btn}
						onClick={(e) => {
							e.stopPropagation();
							togglePause();
						}}>
						{isPaused ? <Play size={16} /> : <Pause size={16} />}
					</button>

					<button
						className={styles.btn}
						onClick={(e) => {
							e.stopPropagation();
							handleEnd();
						}}>
						<X size={16} />
					</button>
				</div>
			)}

			{showAlarm && (
				<div className={styles['alarmOverlay']}>
					<div className={styles['alarmModal']}>
						<div className={styles['alarmHeader']}>
							<h3>Take a break</h3>
							<AlarmClock />
						</div>

						<button
							className={styles['okButton']}
							onClick={async () => {
								await endPomodoro(taskId);

								setShowAlarm(false);
								setActivePomodoroId(null);
								setActivePomoData(null);
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

			<audio ref={audioRef} src='/alarm-clock-beep.wav' loop />
		</>
	);
};

export default PomodoroTimer;
