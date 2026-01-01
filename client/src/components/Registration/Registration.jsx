import './Registration.css';
import Heading from '../Heading.jsx';
import Field from '../Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button.jsx';
import Linking from '../Linking.jsx';

const Registration = () => {
	return (
		<div className='registration'>
			<Heading title='Create Account' text='Sign up to get started' />
			<Field
				innerText='Enter your email'
				Icon={MailIcon}
				id='email'
				type='email'
				label = 'Email'
				/>
			<Field
				innerText='Enter your password'
				Icon={PasswordIcon}
				id='password'
				type='password' 
				label = 'Password'
			/>
			<Field
				innerText='Confirm your password'
				Icon={PasswordIcon}
				id='password'
				type='password' 
				label = 'Confirm password'
			/>

			<Button inner='Sign up' />

			<Linking to="/login" innerText="Already have an account? Sign in" />
		</div>
	);
};

export default Registration;
