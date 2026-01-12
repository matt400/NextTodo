import { useState } from "react";
import { X, Pencil, AlertCircle } from "lucide-react";
import styles from "./EditTaskModal.module.css";

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

    return "";
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
    <div className={styles.modal}>
      <div className={styles.header}>
        <h3 className={styles.title}>Edit task name</h3>

        <button onClick={onClose} className={styles.closeBtn}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="editTaskName">Task Name</label>

          <input
            id="editTaskName"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (inputError) setInputError(validateTaskName(e.target.value));
            }}
            className={`${styles.input} ${inputError ? styles.inputError : ""}`}
            autoFocus
          />

          {inputError && (
            <p className={styles.inputErrorMsg}>
              <AlertCircle size={14} />
              {inputError}
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={`${styles.btn} ${styles.cancel}`}>
            Cancel
          </button>

          <button type="submit" className={`${styles.btn} ${styles.add}`}>
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;
