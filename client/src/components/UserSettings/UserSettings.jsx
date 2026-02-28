import { useState } from 'react';
import { changePassword } from '../../api/auth';

import Navbar from '../Navbar/Navbar';
import Button from '../Button/Button';
import Field from '../Field/Field';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import './UserSettings.css';

const UserSettings = () => {
	const [values, setValues] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState('');

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const validate = (values) => {
		let temp = {};

		// CURRENT PASSWORD
		if (!values.currentPassword) {
			temp.currentPassword = 'Current password is required';
		}

		// NEW PASSWORD
		if (!values.newPassword) {
			temp.newPassword = 'New password is required';
		} else if (values.newPassword.length < 8) {
			temp.newPassword = 'Password must be at least 8 characters long';
		} else if (!/[a-z]/.test(values.newPassword)) {
			temp.newPassword = 'Must contain lowercase letter';
		} else if (!/[A-Z]/.test(values.newPassword)) {
			temp.newPassword = 'Must contain uppercase letter';
		} else if (!/[0-9]/.test(values.newPassword)) {
			temp.newPassword = 'Must contain a digit';
		} else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/~`+=;]/.test(values.newPassword)) {
			temp.newPassword = 'Must contain a special character';
		}

		// CONFIRM PASSWORD
		if (!values.confirmPassword) {
			temp.confirmPassword = 'Confirm your password';
		} else if (values.newPassword !== values.confirmPassword) {
			temp.confirmPassword = 'Passwords do not match';
		}

		return temp;
	};

	const handleChangePassword = async () => {
		setSuccess('');
		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) return;

		try {
			await changePassword(values.currentPassword, values.newPassword, values.confirmPassword);

			setSuccess('Password changed successfully.');
			setValues({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (err) {
			setErrors({
				currentPassword: 'Current password is incorrect',
			});
		}
	};

	return (
		<>
			<Navbar title='Settings' showBack={true} showSettings={false} />

			<div className='main-content'>
				<div className='container'>
					<section className='box'>
						<h2>Change Email</h2>
						<p>Current Email: user@email.com</p>
						<Field innerText='Enter new email' Icon={MailIcon} id='email' type='email' label='Email' />
						<Button inner='Change email' />
					</section>

					<section className='box'>
						<h2>Change Password</h2>
						<Field
							innerText='Enter current password'
							Icon={PasswordIcon}
							id='currentPassword'
							type='password'
							label='Current Password'
							value={values.currentPassword}
							onChange={handleChange}
							error={errors.currentPassword}
						/>

						<Field
							innerText='Enter new password'
							Icon={PasswordIcon}
							id='newPassword'
							type='password'
							label='New Password'
							value={values.newPassword}
							onChange={handleChange}
							error={errors.newPassword}
						/>

						<Field
							innerText='Confirm new password'
							Icon={PasswordIcon}
							id='confirmPassword'
							type='password'
							label='Confirm New Password'
							value={values.confirmPassword}
							onChange={handleChange}
							error={errors.confirmPassword}
						/>
						<Button inner='Change password' onClick={handleChangePassword} />
					</section>
				</div>
			</div>
		</>
	);
};

export default UserSettings;
