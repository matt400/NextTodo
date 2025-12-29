import '../styles/elements/button.css';
import { useNavigate } from 'react-router-dom';

const Button = ({ inner, to, onClick }) => {
	const navigate = useNavigate();

	const handleClick = (e) => {
    if (onClick) onClick(e); 
    if (to) navigate(to); 
  };

	return <button className='button' onClick = {handleClick}>{inner}</button>;
};

export default Button;
