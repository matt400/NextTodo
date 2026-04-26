import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './Field.module.css';

type InputType = 'text' | 'email' | 'password';

interface FieldProps {
  innerText?: string;
  Icon?: LucideIcon;
  id?: string;
  type?: InputType;
  label?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
}

const Field = ({ innerText, Icon, id, type, label, value, onChange, error }: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  useEffect(() => {
    if (showPassword) {
      const timer = setTimeout(() => {
        setShowPassword(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPassword]);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.icon} />}

        <input
          id={id}
          type={inputType}
          placeholder={innerText}
          value={value}
          onChange={onChange}
          className={error ? styles.inputError : styles.input}
        />

        {type === 'password' && (
          <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Field;
