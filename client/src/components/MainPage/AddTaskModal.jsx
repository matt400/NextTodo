import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import '../../styles/elements/add-task-modal.css';

const AddTaskModal = ({ onAdd, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [inputError, setInputError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateTaskName = (name) => {
    if (!name.trim()) return 'Task name cannot be empty';
    if (name.length > 50) return 'Task name must be less than 50 characters';

    const allowedPattern = /^[\p{L}\p{N}\s.,!?'-]+$/u;
    if (!allowedPattern.test(name)) {
      return 'Task name contains unsupported characters. Only letters, numbers, and basic punctuation are allowed.';
    }
    return undefined;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setServerError('');

    const error = validateTaskName(taskName);
    if (error) {
      setInputError(error);
      return;
    }

    if (taskName.toLowerCase().includes('forbidden')) {
      setServerError(
        'Task creation failed: Task name contains forbidden content. Please try a different name.'
      );
      return;
    }

    onAdd(taskName);
    setTaskName('');
    setInputError('');
    setServerError('');
    onClose();
  };

  const handleChange = (value) => {
    setTaskName(value);
    if (inputError) {
      const err = validateTaskName(value);
      setInputError(err || '');
    }
  };

  return (
    <div className="addtask-modal" >
      <div className="addtask-header">
        <h3>Add New Task</h3>
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleAddTask} className="addtask-form">
        {serverError && (
          <div className="error-box">
            <AlertCircle size={16} className="error-icon" />
            <p>{serverError}</p>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="newTaskName">Task Name</label>
          <input
            id="newTaskName"
            type="text"
            value={taskName}
            onChange={(e) => handleChange(e.target.value)}
            className={inputError ? 'input-error' : ''}
            placeholder="Enter task name..."
            autoFocus
          />
          {inputError && <p className="input-error-msg">{inputError}</p>}
        </div>

        <div className="addtask-footer">
          <button type="button" onClick={onClose} className="btn cancel">
            Cancel
          </button>
          <button type="submit" className="btn add">
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTaskModal;