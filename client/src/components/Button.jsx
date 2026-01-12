import '../styles/elements/button.css';
import { useNavigate } from 'react-router-dom';

const Button = ({ inner, to, onClick }) => {
	const navigate = useNavigate();

	const handleClick = (e) => {
		let shouldNavigate = true;

		if (onClick) {
			const result = onClick(e);
			if (result === false) shouldNavigate = false;
		}

		if (to && shouldNavigate) {
			navigate(to);
		}
	};

	return (
		<button className='button' onClick={handleClick}>
			{inner}
		</button>
	);
};

export default Button;
