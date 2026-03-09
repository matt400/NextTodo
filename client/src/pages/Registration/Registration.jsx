import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth.js';

import Heading from '../../components/Heading/Heading.jsx';
import Field from '../../components/Field/Field.jsx';
import Button from '../../components/Button/Button.jsx';
import Linking from '../../components/Linking/Linking.jsx';
import { Mail, Lock, User } from 'lucide-react';
import styles from './Registration.module.css';

const Registration = () => {
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const navigate = useNavigate();

	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);

	const validate = (vals) => {
		let temp = {};

		if (!vals.email) temp.email = 'Email is required';

		if (!vals.email) temp.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(vals.email)) temp.email = 'Enter a correct email address';
		if (!vals.username) temp.username = 'Username is required';
		else if (vals.username.length < 3) temp.username = 'Username must be at least 3 characters';
		if (!vals.password) temp.password = 'Password is required';
		else if (vals.password.length < 8) temp.password = 'Password must be at least 8 characters long';
		else if (!/[a-z]/.test(vals.password)) temp.password = 'Must contain lowercase letter';
		else if (!/[A-Z]/.test(vals.password)) temp.password = 'Must contain uppercase letter';
		else if (!/[0-9]/.test(vals.password)) temp.password = 'Must contain a digit';
		else if (!/[!@#$%^&*()_\-+=\[\]{};:\'",.<>/?`~\\|]/.test(vals.password))
			temp.password = 'Must contain a special character';

		if (!vals.confirmPassword) temp.confirmPassword = 'Confirm your password';
		else if (vals.password !== vals.confirmPassword) temp.confirmPassword = 'Passwords do not match';

		return temp;
	};

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSubmit = async () => {
		console.log('REGISTER CLICK');
		setSubmitted(true);

		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) {
			return;
		}

		try {
			await register(values.username, values.email, values.password, values.confirmPassword);

			navigate('/login', {
				state: { registered: true },
			});
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className={styles.authLayout}>
			<div className={`${styles.registration}`}>
				<Heading title='Create Account' text='Sign up to get started' />

				<Field
					innerText='Enter your email'
					Icon={Mail}
					id='email'
					type='email'
					label='Email'
					value={values.email}
					onChange={handleChange}
					error={submitted ? errors.email : ''}
				/>

				<Field
					innerText='Enter your username'
					Icon={User}
					id='username'
					type='text'
					label='Username'
					value={values.username}
					onChange={handleChange}
					error={submitted ? errors.username : ''}
				/>

				<Field
					innerText='Enter your password'
					Icon={Lock}
					id='password'
					type='password'
					label='Password'
					value={values.password}
					onChange={handleChange}
					error={submitted ? errors.password : ''}
				/>

				<Field
					innerText='Confirm your password'
					Icon={Lock}
					id='confirmPassword'
					type='password'
					label='Confirm password'
					value={values.confirmPassword}
					onChange={handleChange}
					error={submitted ? errors.confirmPassword : ''}
				/>

				<Button inner='Create account' onClick={handleSubmit} />

				<Linking to='/login' innerText='Already have an account? Sign in' />
			</div>
		</div>
	);
};

export default Registration;
