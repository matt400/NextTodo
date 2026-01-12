import styles from './Button.module.css'

const CreateTaskButton = ({ inner, onClick }) => {
	const handleClick = (e) => {
		if (onClick) onClick(e);
	};

	return (
		<button className={`${styles.Button}`} onClick={handleClick}>
			{inner}
		</button>
	);
};

export default CreateTaskButton;
