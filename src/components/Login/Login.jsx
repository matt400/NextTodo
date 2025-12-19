import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
	return (
		<div className='login'>
			<div className='login heading-section'>
				<h1 className='login__header'>Welcome Back</h1>
				<p className='login__text'>Sign in to manage your tasks</p>
			</div>

			<div className='field login__field'>
				<label htmlFor='email'>Email</label>
				<input
					className='field'
					id='email'
					type='email'
					placeholder='Enter your email'
				/>
			</div>
			<div className='field login__field'>
				<label htmlFor='password'>Password</label>
				<input
					className='field'
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
