import { Link } from 'react-router-dom';
import styles from './Linking.module.css';

interface LinkingProps {
  to: string;
  innerText: string;
}

const Linking = ({ to, innerText }: LinkingProps) => {
  return (
    <Link className={styles.Linking} to={to}>
      {innerText}
    </Link>
  );
};

export default Linking;
