import './UserSettings.css';
import Navbar from '../Navbar/Navbar';
import Button from "../Button/Button";
import Field from '../Field/Field';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';

const UserSettings = () => {
	return (
		<>
			<Navbar title='Settings' showBack={true} showSettings={false} />

			<div className='main-content'>
				<div className='container'>
					<section className='box'>
						<h2>Change Email</h2>
						<p>Current Email: user@email.com</p>
						<Field
							innerText='Enter new email'
							Icon={MailIcon}
							id='email'
							type='email'
							label='Email'
						/>
						<Button inner='Change email' />
					</section>

					<section className='box'>
						<h2>Change Password</h2>
						<Field
							innerText='Enter current password'
							Icon={PasswordIcon}
							id='password'
							type='password'
							label='Current Password'
						/>
						<Field
							innerText='Enter new password'
							Icon={PasswordIcon}
							id='password'
							type='password'
							label='New Password'
						/>
						<Field
							innerText='Confirm new password'
							Icon={PasswordIcon}
							id='password'
							type='password'
							label='Confirm New Password'
						/>
						<Button inner='Change password' />
					</section>
				</div>
			</div>
		</>
	);
};

export default UserSettings;
