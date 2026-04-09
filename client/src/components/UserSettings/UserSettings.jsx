import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, updateUserData, removeUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../Button';
import Field from '../Field';
import ThemeSwitch from '../ThemeSwitch';
import { addToast } from '../Toasts';
import { useFeedback } from '../../context/FeedbackContext.jsx';
import { useFeedbackHandler } from '../../helpers/useFeedbackHandler.js';

import {
	Mail,
	Lock,
	Maximize,
	Minimize,
	Plus,
	BellRing,
	MessageSquare,
	User,
	SlidersHorizontal,
	Zap,
	AlertTriangle,
} from 'lucide-react';
import styles from './UserSettings.module.css';

const UserSettings = ({ isFullscreen, setIsFullscreen }) => {
	const [values, setValues] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const { user, setUser } = useAuth();
	const navigate = useNavigate();
	const [newEmail, setNewEmail] = useState('');
	const [openSection, setOpenSection] = useState(null);
	const [successPomodoroChange, setSuccessPomodoroChange] = useState('');
	const [pomodoroErr, setPomodoroErr] = useState('');

	const [errors, setErrors] = useState({});

	const { feedbackType, setFeedbackType } = useFeedback();
	const { handleFeedback } = useFeedbackHandler();

	const [notification, setNotification] = useState('');
	const [passMessage, setPassMessage] = useState('');
	const [passError, setPassError] = useState('');
	const [emailMessage, setEmailMessage] = useState('');
	const [emailError, setEmailError] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteInput, setDeleteInput] = useState('');
	const [deleteMessage, setDeleteMessage] = useState('');
	const [deleteError, setDeleteError] = useState('');

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
		const validationErrors = validate(values);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length !== 0) return;

		try {
			await changePassword(values.currentPassword, values.newPassword, values.confirmPassword);

			handleFeedback('success', 'Password changed successfully.', setPassMessage);

			setValues({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch {
			handleFeedback('error', 'Password change failed', setPassError);

			setValues({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		}
	};

	const handleEmailChange = async () => {
		try {
			await updateUserData({ email: newEmail });
			setUser((prev) => ({ ...prev, email: newEmail }));
			setNewEmail('');
			handleFeedback('success', 'Email changed successfully.', setEmailMessage);
		} catch {
			handleFeedback('error', 'Email change failed', setEmailError);
		}
	};

	const [newPomodoroTime, setNewPomodoroTime] = useState(Number(localStorage.getItem('pomodoroTime')) || 25);

	const handleSetPomodoroTime = () => {
		setSuccessPomodoroChange('');
		setPomodoroErr('');

		const value = Number(newPomodoroTime);

		if (value < 1 || value > 60) {
			handleFeedback('error', 'Time must be between 1 and 60 minutes', setPomodoroErr);
			return;
		}

		localStorage.setItem('pomodoroTime', value);
		window.dispatchEvent(new Event('pomodoroUpdate'));

		handleFeedback('success', 'Pomodoro time updated successfully.', setSuccessPomodoroChange);
	};

	const showNotification = (msg) => {
		setNotification(msg);

		setTimeout(() => {
			setNotification('');
		}, 4000);
	};

	const handleDeleteAccount = async () => {
		try {
			await removeUser(user.email);
			setShowDeleteModal(false);
			addToast('success', 'Account deleted successfully');
			navigate('/login');
		} catch (err) {
			setShowDeleteModal(false);
			addToast('error', err.message || 'Failed to delete account');
		}
	};

	return (
		<div className={styles.settings}>
			<div className={styles.activeHeader}>
				<h2>Settings</h2>
			</div>

			{/* PROFILE */}
			<section className={styles.section}>
				<div
					className={`${styles.sectionHeader} ${openSection === 'profile' ? styles.active : ''}`}
					onClick={() => setOpenSection(openSection === 'profile' ? null : 'profile')}>
					<div className={`${styles.sectionHeaderStart} ${openSection === 'profile' ? styles.active : ''}`}>
						<User size={24} />
						<h3>Profile Settings</h3>
					</div>
					<Plus size={24} className={`${styles.icon} ${openSection === 'profile' ? styles.rotate : ''}`} />
				</div>
				<div className={`${styles.profileGrid} ${openSection === 'profile' ? styles.open : styles.closed}`}>
					{/* EMAIL */}
					<div className={styles.card}>
						<p className={styles.label}>Change Email</p>
						<p className={styles.description}>Your current email is {user?.email}</p>

						<Field innerText='New email' Icon={Mail} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
						<Button inner='Change email' onClick={handleEmailChange} />

						{emailMessage && <p className={styles.successInfo}>{emailMessage}</p>}
						{emailError && <p className={styles.errorInfo}>{emailError}</p>}
					</div>

					{/* PASSWORD */}
					<div className={styles.card}>
						<p className={styles.label}>Change Password</p>
						<p className={styles.description}>Your current password</p>
						<Field
							id='currentPassword'
							type='password'
							value={values.currentPassword}
							onChange={handleChange}
							error={errors.currentPassword}
							innerText='Current password'
							Icon={Lock}
						/>

						<Field
							id='newPassword'
							type='password'
							value={values.newPassword}
							onChange={handleChange}
							error={errors.newPassword}
							innerText='New password'
							Icon={Lock}
						/>

						<Field
							id='confirmPassword'
							type='password'
							value={values.confirmPassword}
							onChange={handleChange}
							error={errors.confirmPassword}
							innerText='Confirm password'
							Icon={Lock}
						/>

						<Button inner='Change password' onClick={handleChangePassword} />

						{passMessage && <p className={styles.successInfo}>{passMessage}</p>}
						{passError && <p className={styles.errorInfo}>{passError}</p>}
					</div>
					<div className={styles.dangerZone}>
						<p className={styles.dangerHeader}>
							<AlertTriangle size={24} /> Danger Zone
						</p>
						<p className={styles.dangerTitle}>Permanently delete your account</p>
						<div className={styles.deleteFooter}>
							<p className={styles.dangerDescription}>This action cannot be undone</p>
							<Button inner='Delete account' onClick={() => setShowDeleteModal(true)} />
						</div>
					</div>
				</div>
			</section>

			{/* PREFERENCES */}
			<section className={styles.section}>
				<div
					className={`${styles.sectionHeader} ${openSection === 'preferences' ? styles.active : ''}`}
					onClick={() => setOpenSection(openSection === 'preferences' ? null : 'preferences')}>
					<div className={`${styles.sectionHeaderStart} ${openSection === 'preferences' ? styles.active : ''}`}>
						<SlidersHorizontal size={24} />
						<h3>Preferences</h3>
					</div>

					<Plus className={`${styles.icon} ${openSection === 'preferences' ? styles.rotate : ''}`} />
				</div>

				<div className={`${styles.group} ${openSection === 'preferences' ? styles.open : styles.closed}`}>
					<div className={styles.settingRow}>
						<div>
							<p className={styles.label}>Theme</p>
							<p className={styles.description}>Auto / Light / Dark</p>
						</div>
						<ThemeSwitch />
					</div>

					<div className={styles.settingRow}>
						<div>
							<p className={styles.label}>View</p>
							<p className={styles.description}>Window / Fullscreen</p>
						</div>

						<div className={styles.viewWrapper}>
							<button className={!isFullscreen ? styles.active : ''} onClick={() => setIsFullscreen(false)}>
								Window <Minimize size={16} />
							</button>

							<button className={isFullscreen ? styles.active : ''} onClick={() => setIsFullscreen(true)}>
								Fullscreen <Maximize size={16} />
							</button>
						</div>
					</div>

					<div className={styles.settingRow}>
						<div>
							<p className={styles.label}>Notifications</p>
							<p className={styles.description}>Toast / Inline</p>
						</div>

						<div className={styles.viewWrapper}>
							<button
								className={feedbackType === 'toast' ? styles.active : ''}
								onClick={() => {
									setFeedbackType('toast');
									addToast('info', 'Toasts notifications enabled');
								}}>
								Toast
								<BellRing size={16} />
							</button>

							<button
								className={feedbackType === 'inline' ? styles.active : ''}
								onClick={() => {
									setFeedbackType('inline');
									showNotification('Inline notifications enabled');
								}}>
								Inline
								<MessageSquare size={16} />
							</button>
						</div>
					</div>

					{notification && <p className={styles.successInfo}>{notification}</p>}
				</div>
			</section>

			{/* PRODDUCTIVITY */}
			<section className={styles.section}>
				<div
					className={`${styles.sectionHeader} ${openSection === 'productivity' ? styles.active : ''}`}
					onClick={() => setOpenSection(openSection === 'productivity' ? null : 'productivity')}>
					<div className={`${styles.sectionHeaderStart} ${openSection === 'productivity' ? styles.active : ''}`}>
						<Zap size={24} />
						<h3>Productivity</h3>
					</div>

					<Plus className={`${styles.icon} ${openSection === 'productivity' ? styles.rotate : ''}`} />
				</div>

				<div className={`${styles.group} ${openSection === 'productivity' ? styles.open : styles.closed}`}>
					<div className={styles.settingRow}>
						<div>
							<p className={styles.label}>Pomodoro</p>
							<p className={styles.description}>Set focus duration</p>
						</div>

						<div className={styles.pomodoroSettings}>
							<input
								type='number'
								min='1'
								max='60'
								value={newPomodoroTime}
								onChange={(e) => {
									const val = e.target.value;
									if (val === '') return setNewPomodoroTime('');
									const num = Number(val);
									if (num >= 1 && num <= 60) setNewPomodoroTime(num);
								}}
							/>
							<span className={styles.description}>min</span>
							<button onClick={handleSetPomodoroTime}>Set Time</button>
						</div>
					</div>

					{(successPomodoroChange || pomodoroErr) && (
						<div className={styles.centerInfo}>
							{successPomodoroChange && <p className={styles.successInfo}>{successPomodoroChange}</p>}
							{pomodoroErr && <p className={styles.errorInfo}>{pomodoroErr}</p>}
						</div>
					)}
				</div>
			</section>

			{showDeleteModal && (
				<div className={styles.overlay}>
					<div className={styles.modal}>
						<h3>Delete account</h3>
						<p>
							Type your username ''<strong>{user?.username}</strong>'' to confirm account deletion. This is permanent
							and irreversible.
						</p>

						<input
							className={styles.modalInput}
							placeholder='Enter your username'
							value={deleteInput}
							onChange={(e) => setDeleteInput(e.target.value)}
						/>

						<div className={styles.actions}>
							<button className={styles.cancel} onClick={() => setShowDeleteModal(false)}>
								Cancel
							</button>
							<button
								className={styles.confirm}
								disabled={deleteInput !== user?.username}
								onClick={handleDeleteAccount}>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
			{deleteMessage && <p className={styles.successInfo}>{deleteMessage}</p>}
			{deleteError && <p className={styles.errorInfo}>{deleteError}</p>}
		</div>
	);
};

export default UserSettings;
