import styles from './createTaskButton.module.css';

interface CreateTaskButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const CreateTaskButton = ({ children, onClick }: CreateTaskButtonProps) => {
  return (
    <button className={styles.createTaskButton} onClick={onClick}>
      {children}
    </button>
  );
};

export default CreateTaskButton;
