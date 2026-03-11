import styles from './Loader.module.css';

export const Loader = () => {
	return (
		<div className={styles.backdrop}>
			<span className={styles.loader}></span>
		</div>
	);
};

export default Loader;