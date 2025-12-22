import './Login.css';
import './Login-media.css';
import Heading from '../Heading.jsx';
import Field from '../Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button.jsx';
import Linking from '../Linking.jsx';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<div className='login'>
			<Heading title='Welcome Back' text='Sign in to manage your tasks' />

			<Field
				innerText='Enter your email'
				Icon={MailIcon}
				id='email'
				type='email'
				label='Email'
			/>

			<Field
				innerText='Enter your password'
				Icon={PasswordIcon}
				id='password'
				type='password'
				label='Password'
			/>

			<Button inner='Sign in' to='/mainpage' />
			<Linking to='/register' innerText="Don't have an account? Sign up" />
			<Linking to='/settings' innerText='Settings' />
		</div>
	);
};

export default Login;
