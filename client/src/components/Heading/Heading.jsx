import styles from './Heading.module.css'

const Heading = ({title, text}) => {
	return (
		<div className={`${styles.heading}`}>
			<h1 className={`${styles.headingTitle}`}>{title}</h1>
			<p className={`${styles.headingText}`}>{text}</p>
		</div>
	);
};


export default Heading;