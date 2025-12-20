import { Link } from 'react-router-dom';
import './Registration.css';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';

const Registration = () => {
	return (
		<div className='registration'>
			<div className='heading-section'>
				<h1 className='registration__header'>Create Account</h1>
				<p className='registration__text'>Sign up to get started</p>
			</div>

			<div className='field email'>
				<MailIcon className='icon' />
				<label htmlFor='email'>Email</label>
				<input
					className='email-input'
					id='email'
					type='email'
					placeholder='Enter your email'
				/>
			</div>

			<div className='field password'>
				<PasswordIcon className='icon' />
				<label htmlFor='password'>Password</label>
				<span className='icon'></span>
				<input
					className='password-input'
					id='password'
					type='password'
					placeholder='Enter your password'
				/>
			</div>

			<div className='field password'>
				<PasswordIcon className='icon' />
				<label htmlFor='password'>Confirm Password</label>
				<span className='icon'></span>
				<input
					className='password-input'
					id='password'
					type='password'
					placeholder='Confirm your password'
				/>
			</div>

			<button className='button registration__sign-in-btn'>Create Account</button>

			<Link className='login__registration-link' to='/login'>
				Already have an account? Sign in
			</Link>
		</div>
	);
};

export default Registration;
