import { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error('Uncaught error:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: '2rem', textAlign: 'center' }}>
					<h2>Something went wrong.</h2>
					<button onClick={() => this.setState({ hasError: false })}>Try again</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
