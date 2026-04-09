import styles from './Loader.module.css';

const Loader = () => {
	return (
		<div className={styles.backdrop}>
			<span className={styles.loader}></span>
		</div>
	);
};

export default Loader;