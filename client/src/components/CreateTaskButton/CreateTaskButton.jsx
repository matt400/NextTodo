import styles from './createTaskButton.module.css';

const CreateTaskButton = ({ children, onClick }) => {
	return (
		<button className={styles.createTaskButton} onClick={onClick}>
			{children}
		</button>
	);
};

export default CreateTaskButton;
