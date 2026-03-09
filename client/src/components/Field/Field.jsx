import styles from "./Field.module.css";

const Field = ({
  innerText,
  Icon,
  id,
  type,
  label,
  value,
  onChange,
  error
}) => {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.icon} />}

        <input
          id={id}
          type={type}
          placeholder={innerText}
          value={value}
          onChange={onChange}
          className={error ? styles.inputError : styles.input}
        />
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Field;
