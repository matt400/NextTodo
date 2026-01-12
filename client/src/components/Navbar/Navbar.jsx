import { useNavigate } from "react-router-dom";
import ReturnIcon from "../../assets/icons/ReturnIcon.jsx";
import ExitIcon from "../../assets/icons/ExitIcon.jsx";
import SettingsIcon from "../../assets/icons/SettingsIcon.jsx";
import styles from "./Navbar.module.css";

const Navbar = ({ title, showBack = true, showSettings = true }) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.left}>
          {showBack && (
            <button
              className={styles.backButton}
              onClick={() => navigate("/mainpage")}
            >
              <ReturnIcon />
            </button>
          )}

          <div className={styles.titleEmail}>
            <span className={styles.title}>{title}</span>
            <span className={styles.userEmail}>user@email.com</span>
          </div>
        </div>

        <div className={styles.right}>
          {showSettings && (
            <button
              className={styles.icon}
              aria-label="Settings"
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon />
            </button>
          )}

          <button
            className={styles.icon}
            aria-label="Logout"
            onClick={() => navigate("/login")}
          >
            <ExitIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
