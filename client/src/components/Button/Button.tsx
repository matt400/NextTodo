import { useNavigate } from 'react-router-dom';
import styles from './Button.module.css';

interface ButtonProps {
  inner: React.ReactNode;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
}

const Button = ({ inner, to, onClick }: ButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    let shouldNavigate = true;

    if (onClick) {
      const result = onClick(e);
      if (result === false) shouldNavigate = false;
    }

    if (to && shouldNavigate) {
      navigate(to);
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      {inner}
    </button>
  );
};

export default Button;
