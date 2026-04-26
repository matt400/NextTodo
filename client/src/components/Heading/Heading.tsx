import { CheckSquare } from 'lucide-react';
import styles from './Heading.module.css';

interface HeadingProps {
  title: string;
  text: string;
}

const Heading = ({ title, text }: HeadingProps) => {
  return (
    <div className={styles.heading}>
      <div className={styles.headingTitle}>
        <CheckSquare className={styles.logo} size={36} strokeWidth={2.2} />
        <h1>{title}</h1>
      </div>
      <p className={styles.headingText}>{text}</p>
    </div>
  );
};

export default Heading;
