import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useLocation } from 'react-router-dom';

import Heading from '../Heading/Heading.jsx';
import Field from '../Field/Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button/Button';
import Linking from '../Linking/Linking.jsx';

import styles from './Login.module.css';

const Login = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	});
	const location = useLocation();
	const registered = location.state?.registered;
	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();

	const validate = (vals) => {
		let temp = {};
		if (!vals.email) {
			temp.email = 'Email is required';
		}
		if (!vals.password) {
			temp.password = 'Password is required';
		}

		return temp;
	};

	const handleSubmit = async () => {
		setSubmitted(true);

		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) {
			return;
		}

		try {
			await login(values.email, values.password);
			navigate('/mainpage');
		} catch (err) {
			setErrors({
				password: 'Wrong email or password',
			});
		}
	};

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	return (
		<div className={`${styles.login}`}>
			<Heading title='Welcome Back' text='Sign in to manage your tasks' />

			{registered && (
				<p style={{ color: 'green', marginBottom: '1rem' }}>
					Your account has been created successfully.
				</p>
			)}

			<Field
				innerText='Enter your email'
				Icon={MailIcon}
				id='email'
				type='email'
				label='Email'
				value={values.email}
				onChange={handleChange}
				error={submitted ? errors.email : ''}
			/>

			<Field
				innerText='Enter your password'
				Icon={PasswordIcon}
				id='password'
				type='password'
				label='Password'
				value={values.password}
				onChange={handleChange}
				error={submitted ? errors.password : ''}
			/>

			<Button inner='Sign in' onClick={handleSubmit} />

			<Linking to='/register' innerText="Don't have an account? Sign up" />
		</div>
	);
};

export default Login;
