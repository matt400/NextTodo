import { Link } from 'react-router-dom';
import styles from '../Linking/Linking.module.css';

const Linking = ({ to, innerText }) => {
  return (
    <Link className={`${styles.Linking}`} to={to}>
      {innerText}
    </Link>
  );
};

export default Linking;

