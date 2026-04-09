import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

const Button = ({ inner, to, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
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
