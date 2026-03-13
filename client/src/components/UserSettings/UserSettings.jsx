import { useState } from 'react';
import { changePassword } from '../../api/auth';
import { useAuth } from '../../context/AuthContext.jsx';

import Button from '../Button';
import Field from '../Field';
import ThemeSwitch from '../ThemeSwitch';

import { Mail, Lock, Maximize, Minimize, Expand, Shrink } from 'lucide-react';
import styles from './UserSettings.module.css';

const UserSettings = ({ isFullscreen, setIsFullscreen }) => {
	const [values, setValues] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const { user } = useAuth();
	const [successPassChange, setSuccessPassChange] = useState('');
	const [apiPassChangeError, setApiPassChangeError] = useState('');

	const [successPomodoroChange, setSuccessPomodoroChange] = useState('');
	const [pomodoroErr, setPomodoroErr] = useState('');

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { id, value } = e.target;

		setValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const validate = (values) => {
		let temp = {};

		if (!values.currentPassword) {
			temp.currentPassword = 'Current password is required';
		}

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

		if (!values.confirmPassword) {
			temp.confirmPassword = 'Confirm your password';
		} else if (values.newPassword !== values.confirmPassword) {
			temp.confirmPassword = 'Passwords do not match';
		}

		return temp;
	};

	const handleChangePassword = async () => {
		setSuccessPassChange('');
		setApiPassChangeError('');
		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) return;

		try {
			await changePassword(values.currentPassword, values.newPassword, values.confirmPassword);

			setSuccessPassChange('Password changed successfully.');

			setTimeout(() => {
				setSuccessPassChange('');
			}, 5000);

			setValues({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (err) {
			setApiPassChangeError('Password change failed');

			setTimeout(() => {
				setApiPassChangeError('');
			}, 5000);

			setValues({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		}
	};

	const [newPomodoroTime, setNewPomodoroTime] = useState(Number(localStorage.getItem('pomodoroTime')) || 25);

	const handleSetPomodoroTime = () => {
		setSuccessPomodoroChange('');
		setPomodoroErr('');

		const value = Number(newPomodoroTime);

		if (value < 1 || value > 60) {
			setPomodoroErr('Time must be between 1 and 60 minutes');

			setTimeout(() => {
				setPomodoroErr('');
			}, 5000);

			return;
		}

		localStorage.setItem('pomodoroTime', value);
		window.dispatchEvent(new Event('pomodoroUpdate'));

		setSuccessPomodoroChange('Pomodoro time updated successfully');

		setTimeout(() => {
			setSuccessPomodoroChange('');
		}, 5000);
	};

	return (
		<>
			<div className={styles.mainContent}>
				<div className={styles.container}>
					<section className={styles.box}>
						<h2>Change Email</h2>
						<p>
							Current Email: <strong>{user?.email}</strong>
						</p>
						<Field innerText='Enter new email' Icon={Mail} id='email' type='email' label='Email' />
						<Button inner='Change email' />
					</section>

					<section className={styles.box}>
						<h2>Change Password</h2>

						<Field
							innerText='Enter current password'
							Icon={Lock}
							id='currentPassword'
							type='password'
							label='Current Password'
							value={values.currentPassword}
							onChange={handleChange}
							error={errors.currentPassword}
						/>

						<Field
							innerText='Enter new password'
							Icon={Lock}
							id='newPassword'
							type='password'
							label='New Password'
							value={values.newPassword}
							onChange={handleChange}
							error={errors.newPassword}
						/>

						<Field
							innerText='Confirm new password'
							Icon={Lock}
							id='confirmPassword'
							type='password'
							label='Confirm New Password'
							value={values.confirmPassword}
							onChange={handleChange}
							error={errors.confirmPassword}
						/>

						<Button inner='Change password' onClick={handleChangePassword} />

						{successPassChange && <p className={styles.successInfo}>{successPassChange}</p>}
						{apiPassChangeError && <p className={styles.errorInfo}>{apiPassChangeError}</p>}
					</section>

					<section className={`${styles.box} ${styles.desktopOnly}`}>
						<div className={styles.headerRow}>
							<h2>View</h2>

							<div className={styles.viewWrapper}>
								<button className={!isFullscreen ? styles.active : ''} onClick={() => setIsFullscreen(false)}>
									Window
									<Minimize size={16} />
								</button>

								<button className={isFullscreen ? styles.active : ''} onClick={() => setIsFullscreen(true)}>
									Fullscreen
									<Maximize size={16} />
								</button>
							</div>
						</div>
					</section>

					<section className={styles.box}>
						<div className={styles.headerRow}>
							<h2>Theme</h2>
							<ThemeSwitch />
						</div>
					</section>

					<section className={styles.box}>
						<div className={styles.headerRow}>
							<div className={styles.pomodoroSettings}>
								<h2>Pomodoro</h2>
								<input
									type='number'
									min='1'
									max='60'
									value={newPomodoroTime}
									onChange={(e) => {
										const value = e.target.value;

										if (value === '') {
											setNewPomodoroTime('');
											return;
										}

										const num = Number(value);

										if (num >= 1 && num <= 60) {
											setNewPomodoroTime(num);
										}
									}}
								/>
								<span className={styles.unit}>min</span>

								<button onClick={handleSetPomodoroTime}>Set Time</button>

								<div className={styles.pomodoroInfoContainer}>
									{successPomodoroChange && <p className={styles.successInfo}>{successPomodoroChange}</p>}
									{pomodoroErr && <p className={styles.errorInfo}>{pomodoroErr}</p>}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default UserSettings;
