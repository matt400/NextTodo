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
    <div className="field">

      <label htmlFor={id}>{label}</label>

      <div className="field-input-wrapper">
        {Icon && <Icon className="icon" />}

        <input
          id={id}
          type={type}
          placeholder={innerText}
          value={value}
          onChange={onChange}
          className={error ? "input input--error" : "input"}
        />
      </div>

      {error && <span className="field-error">{error}</span>}
    </div>
  );
};


export default Field;