import { useState } from "react";
import { X, Pencil, AlertCircle } from "lucide-react";
import "../../styles/elements/add-task-modal.css";

const EditTaskModal = ({ task, onUpdate, onClose }) => {
  const [value, setValue] = useState(task.text);
  const [inputError, setInputError] = useState("");

  const validateTaskName = (name) => {
    if (!name.trim()) return "Task name cannot be empty";
    if (name.length > 50) return "Task name must be less than 50 characters";

    const allowedPattern = /^[\p{L}\p{N}\s.,!?'-]+$/u;
    if (!allowedPattern.test(name)) {
      return "Task name contains unsupported characters.";
    }

    return undefined;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validateTaskName(value);
    if (err) {
      setInputError(err);
      return;
    }

    onUpdate(task.id, value); 
    onClose();
  };

  return (
    <div className="addtask-modal" onClick={onClose}>
      <div className="addtask-content" onClick={(e) => e.stopPropagation()}>
        <div className="addtask-header">
          <h3>Edit task name</h3>

          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="addtask-form">
          <div className="input-group">
            <label htmlFor="editTaskName">Task Name</label>

            <input
              id="editTaskName"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={inputError ? "input-error" : ""}
              autoFocus
            />

            {inputError && (
              <p className="input-error-msg">
                <AlertCircle size={14} /> {inputError}
              </p>
            )}
          </div>

          <div className="addtask-footer">
            <button type="button" onClick={onClose} className="btn cancel">
              Cancel
            </button>

            <button type="submit" className="btn add">
              <Pencil size={16} />
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
