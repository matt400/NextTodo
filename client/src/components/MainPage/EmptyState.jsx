import '../../styles/elements/empty-state.css';

const EmptyState = () => {
	return (
		<div className='empty-state'>
			<h1>Active tasks (0)</h1>
			<p>No active tasks. Add a new task to get started!</p>
		</div>
	);
};

export default EmptyState;
