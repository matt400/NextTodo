import { Link } from 'react-router-dom';
import './Login.css';
import './LoginMedia.css';
import MailIcon from '../../assets/icons/MailIcon.jsx'
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx'

const Login = () => {
	return (
		<div className='login'>
			<div className='heading-section'>
				<h1 className='login__header'>Welcome Back</h1>
				<p className='login__text'>Sign in to manage your tasks</p>
			</div>

			<div className='field email'>
				<MailIcon className = "icon"/>
				<label htmlFor='email'>Email</label>
				<input
					className='email-input'
					id='email'
					type='email'
					placeholder='Enter your email'
				/>
			</div>
			<div className='field password'>
				<PasswordIcon className = "icon"/>
				<label htmlFor='password'>Password</label>
				<span className='icon'></span>
				<input
					className='password-input'
					id='password'
					type='password'
					placeholder='Enter your password'
				/>
			</div>

			<button className='button login__sign-in-btn'>Sign In</button>

			<Link className='login__registration-link' to='/registration'>
				Don't have an account? Sign up
			</Link>
		</div>
	);
};

export default Login;
