import { useState, useEffect, useRef } from "react";
import { Play, Pause, X, AlarmClock } from "lucide-react";
import styles from "./PomodoroTimer.module.css";

const PomodoroTimer = ({ taskId, activePomodoroId, setActivePomodoroId }) => {

  const [pomodoroMinutes, setPomodoroMinutes] = useState(
    Number(localStorage.getItem("pomodoroTime")) || 25
  );

  const POMODORO_TIME = pomodoroMinutes * 60;

  const showPomodoro = activePomodoroId === taskId;

  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);

  const audioRef = useRef(null);

  const formatTime = (total) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const togglePomodoro = () => {
    if (activePomodoroId === taskId) {
      setActivePomodoroId(null);
      setSeconds(0);
      setIsPaused(false);
    } else {
      setActivePomodoroId(taskId);
      setSeconds(0);
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (activePomodoroId !== taskId) {
      setSeconds(0);
      setIsPaused(false);
    }
  }, [activePomodoroId, taskId]);

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
      const stored = Number(localStorage.getItem("pomodoroTime"));
      if (stored) setPomodoroMinutes(stored);
    };

    window.addEventListener("pomodoroUpdate", handler);

    return () => window.removeEventListener("pomodoroUpdate", handler);
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
            }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          <button
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              togglePomodoro();
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showAlarm && (
        <div className={styles["alarmOverlay"]}>
          <div className={styles["alarmModal"]}>
            <div className={styles["alarmHeader"]}>
              <h3>Take a break</h3>
              <AlarmClock />
            </div>

            <button
              className={styles["okButton"]}
              onClick={() => {
                setShowAlarm(false);
                setActivePomodoroId(null);
                setSeconds(0);
                setIsPaused(false);

                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} src="/alarm-clock-beep.wav" loop />
    </>
  );
};

export default PomodoroTimer;