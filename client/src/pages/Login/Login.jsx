import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/auth.js';
import { Mail, Lock } from 'lucide-react';
import { getMe } from '../../api/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFeedbackHandler } from '../../helpers/useFeedbackHandler';

import Heading from '../../components/Heading/Heading.jsx';
import Field from '../../components/Field/Field.jsx';
import Button from '../../components/Button/Button.jsx';
import Linking from '../../components/Linking/Linking.jsx';

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
	const { setUser } = useAuth();
	const [formMessage, setFormMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const { handleFeedback } = useFeedbackHandler();
	const hasShown = useRef(false);
	
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
			
			const me = await getMe();
			setUser(me);
			
			navigate('/maincontent');
		} catch {
			setErrors({
				password: 'Wrong email or password',
			});
			
			handleFeedback('error', 'Wrong email or password', (msg) => {
				setIsError(true);
				setFormMessage(msg);
			});
		}
	};
	console.log('LOCATION STATE:', location.state);
	console.log('REGISTERED:', registered);
	
	const handleChange = (e) => {
		const { id, value } = e.target;
		
		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
		
		setErrors((prev) => ({
			...prev,
			[id]: '',
		}));

		// setFormMessage('');
	};

	useEffect(() => {
		if (registered && !hasShown.current) {
			hasShown.current = true;

			handleFeedback('success', 'Account created successfully. You can now log in.', (msg) => {
				setIsError(false);
				setFormMessage(msg);
			});

			window.history.replaceState({}, document.title);
		}
	}, [registered, handleFeedback]);

	return (
		<div className={styles.authLayout}>
			<div className={`${styles.login}`}>
				<Heading title='Welcome Back' text='Sign in to manage your tasks' />

				{formMessage && <p className={isError ? styles.errorInfo : styles.successInfo}>{formMessage}</p>}

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
					innerText='Enter your password'
					Icon={Lock}
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
		</div>
	);
};

export default Login;
