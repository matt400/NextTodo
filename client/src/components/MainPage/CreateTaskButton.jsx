import '../../styles/elements/button.css';

const CreateTaskButton = ({ inner, onClick }) => {
	const handleClick = (e) => {
		if (onClick) onClick(e);
	};

	return (
		<button className='button' onClick={handleClick}>
			{inner}
		</button>
	);
};

export default CreateTaskButton;
