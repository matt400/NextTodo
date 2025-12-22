import '../styles/elements/heading.css'

const Heading = ({title, text}) => {
	return (
		<div className='heading'>
			<h1 className='heading__title'>{title}</h1>
			<p className='heading__text'>{text}</p>
		</div>
	);
};


export default Heading;