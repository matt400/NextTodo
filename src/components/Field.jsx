import '../styles/elements/field.css';

const Field = ({ innerText, Icon, id, type, label }) => {
	return (
		<div className='field'>
			{Icon && <Icon className='icon' />}
			<label htmlFor={id}>{label}</label>
			<input className='input' id={id} type={type} placeholder={innerText} />
		</div>
	);
};

export default Field;
