import { useNavigate } from 'react-router-dom';
import '../styles/elements/navbar.css';
import ReturnIcon from '../assets/icons/ReturnIcon.jsx';
import ExitIcon from '../assets/icons/ExitIcon.jsx';
import SettingsIcon from '../assets/icons/SettingsIcon.jsx';

const Navbar = ({ title, showBack = true, showSettings = true }) => {
	const navigate = useNavigate();

	return (
		<nav className='nav'>
			<div className='nav__inner'>
				<div className='nav__left'>
					{showBack && (
						<button className='back-button' onClick={() => navigate('/mainpage')}>
							<ReturnIcon />
						</button>
					)}
					<div className='title-email'>
						<span className='nav__app-name'>{title}</span>
						<span className='nav__user-email'>user@email.com</span>
					</div>
				</div>

				<div class='nav__right'>
					{showSettings && (
						<button
							className='nav__icon'
							aria-label='Settings'
							onClick={() => navigate('/settings')}>
							<SettingsIcon />
						</button>
					)}
					<button
						className='nav__icon'
						aria-label='Logout'
						onClick={() => navigate('/login')}>
						<ExitIcon />
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
