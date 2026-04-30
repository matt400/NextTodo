import { useEffect, useState } from 'react';
import { SquareCheck } from 'lucide-react';
import styles from './SplashScreen.module.css';

const STORAGE_KEY = 'nexttodo_splash_shown';

const SplashScreen = () => {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(STORAGE_KEY));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fadeTimer = setTimeout(() => setFading(true), 1500);
    const hideTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${fading ? styles.fading : ''}`}>
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <SquareCheck size={72} className={styles.logo} />
        </div>
        <h1 className={styles.title}>NextTodo</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
