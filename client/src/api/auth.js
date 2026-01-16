const API_URL = 'http://localhost:3000/api/auth';

export async function register(username, email, password, confirm_password) {
	const res = await fetch(`${API_URL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ username, email, password, confirm_password }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || 'Registration failed');
	}

	return res.json();
}

export async function login(email, password) {
	const res = await fetch(`${API_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || 'Login failed');
	}

	return res.json();
}

export async function getMe() {
	const res = await fetch(`${API_URL}/me`, {
		credentials: 'include',
	});

	if (res.status === 401) return null;
	return res.json();
}

export async function logout() {
	return fetch(`${API_URL}/logout`, {
		method: 'POST',
		credentials: 'include',
	});
}
