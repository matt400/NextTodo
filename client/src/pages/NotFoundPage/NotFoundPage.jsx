import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
