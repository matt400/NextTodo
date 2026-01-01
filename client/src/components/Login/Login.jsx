import { useState } from 'react';
import './Login.css';
import './Login-media.css';
import Heading from '../Heading.jsx';
import Field from '../Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button.jsx';
import Linking from '../Linking.jsx';

const Login = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});

	const validateLive = (field, value) => {
		let message = '';

		if (field === 'email') {
			if (!value) message = 'Email is required';
			else if (!/\S+@\S+\.\S+/.test(value))
				message = 'Enter a correct email address';
		}

		if (field === 'password') {
			if (!value) {
				message = 'Password is required';
			} else if (value.length < 8) {
				message = 'Password must be at least 8 characters long';
			} else if (value.length > 64) {
				message = 'Password can have a maximum of 64 characters';
			} else if (!/[a-z]/.test(value)) {
				message = 'Password must contain at least one lowercase letter';
			} else if (!/[A-Z]/.test(value)) {
				message = 'Password must contain at least one uppercase letter';
			} else if (!/[0-9]/.test(value)) {
				message = 'Password must contain at least one digit';
			} else if (!/[!@#$%^&*()_\-+=\[\]{};:\'",.<>/?`~\\|]/.test(value)) {
				message = 'Password must contain at least one special character';
			} else if (/\s/.test(value)) {
				message = 'Password cannot contain spaces';
			} else {
				message = '';
			}
		}

		setErrors((prev) => ({
			...prev,
			[field]: message,
		}));
	};

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));

		validateLive(id, value);
	};

	return (
		<div className='login'>
			<Heading title='Welcome Back' text='Sign in to manage your tasks' />

			<Field
				innerText='Enter your email'
				Icon={MailIcon}
				id='email'
				type='email'
				label='Email'
				value={values.email}
				onChange={handleChange}
				error={errors.email}
			/>

			<Field
				innerText='Enter your password'
				Icon={PasswordIcon}
				id='password'
				type='password'
				label='Password'
				value={values.password}
				onChange={handleChange}
				error={errors.password}
			/>

			<Button inner='Sign in' to='/mainpage' />

			<Linking to='/register' innerText="Don't have an account? Sign up" />
		</div>
	);
};

export default Login;
