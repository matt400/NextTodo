import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import styles from './AddTaskModal.module.css';

const AddTaskModal = ({ onAdd, onClose }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [inputError, setInputError] = useState('');
	const [serverError, setServerError] = useState('');

	const validateTitle = (value) => {
		if (!value.trim()) return 'Title is required';
		if (value.length > 50) return 'Title must be less than 50 characters';

		const allowedPattern = /^[\p{L}\p{N}\s.,!?'"/:()#\p{Pd}]+$/u;
		if (!allowedPattern.test(value)) {
			return 'Title contains unsupported characters.';
		}

		return '';
	};

	const handleAddTask = (e) => {
		e.preventDefault();
		setServerError('');

		const error = validateTitle(title);
		if (error) {
			setInputError(error);
			return;
		}

		onAdd({
			title,
			description,
		});

		setTitle('');
		setDescription('');
		setInputError('');
		setServerError('');
		onClose();
	};

	const handleTitleChange = (value) => {
		setTitle(value);
		if (inputError) {
			setInputError(validateTitle(value));
		}
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h3 className={styles.title}>Add New Task</h3>
					<button onClick={onClose} className={styles.closeBtn}>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleAddTask} className={styles.form}>
					{serverError && (
						<div className={styles.errorBox}>
							<AlertCircle size={16} className={styles.errorIcon} />
							<p className={styles.errorText}>{serverError}</p>
						</div>
					)}

					<div className={styles.inputGroup}>
						<label htmlFor='newTaskTitle'>Task Title</label>
						<input
							id='newTaskTitle'
							type='text'
							value={title}
							onChange={(e) => handleTitleChange(e.target.value)}
							className={`${styles.input} ${inputError ? styles.inputError : ''}`}
							placeholder='Enter task title...'
							autoFocus
						/>
						{inputError && <p className={styles.inputErrorMsg}>{inputError}</p>}
					</div>

					<div className={styles.inputGroup}>
						<label>Description (optional)</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={styles.input}
							placeholder='Enter description...'
						/>
					</div>

					<div className={styles.footer}>
						<button type='button' onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
							Cancel
						</button>
						<button type='submit' className={`${styles.btn} ${styles.add}`}>
							<Plus size={16} />
							Add Task
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddTaskModal;
