import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../Heading/Heading.jsx';
import Field from '../Field/Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button/Button';
import Linking from '../Linking/Linking.jsx';
import styles from  './Login.module.css';

const Login = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();

	const validate = (vals) => {
		let temp = {};

		if (!vals.email) temp.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(vals.email))
			temp.email = 'Enter a correct email address';

		if (!vals.password) temp.password = 'Password is required';
		else if (vals.password.length < 8)
			temp.password = 'Password must be at least 8 characters long';
		else if (vals.password.length > 64)
			temp.password = 'Password can have a maximum of 64 characters';
		else if (!/[a-z]/.test(vals.password))
			temp.password = 'Password must contain at least one lowercase letter';
		else if (!/[A-Z]/.test(vals.password))
			temp.password = 'Password must contain at least one uppercase letter';
		else if (!/[0-9]/.test(vals.password))
			temp.password = 'Password must contain at least one digit';
		else if (!/[!@#$%^&*()_\-+=\[\]{};:\'",.<>/?`~\\|]/.test(vals.password))
			temp.password = 'Password must contain at least one special character';
		else if (/\s/.test(vals.password))
			temp.password = 'Password cannot contain spaces';

		return temp;
	};

	const handleSubmit = () => {
		setSubmitted(true);

		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) {
			return;
		}

		navigate('/mainpage');
	};

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	return (
		<div className= {`${styles.login}`}>
			<Heading title='Welcome Back' text='Sign in to manage your tasks' />

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

			<Button inner="Sign in" onClick={handleSubmit} />


			<Linking to='/register' innerText="Don't have an account? Sign up" />
		</div>
	);
};

export default Login;
