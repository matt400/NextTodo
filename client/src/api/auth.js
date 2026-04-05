const API_URL = 'http://localhost:3000/api';
const AUTH_URL = API_URL + '/auth';
const USER_URL = API_URL + '/user';

export async function register(username, email, password, confirm_password) {
	const res = await fetch(`${AUTH_URL}/register`, {
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
	const res = await fetch(`${AUTH_URL}/login`, {
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
	const res = await fetch(`${USER_URL}/me`, {
		method: 'GET',
		credentials: 'include',
	});
	if (res.status != 200) return false;
	return res.json();
}

export async function logout() {
	return fetch(`${USER_URL}/logout`, {
		method: 'POST',
		credentials: 'include',
	});
}

export async function changePassword(currentPassword, newPassword, confirmPassword) {
	const res = await fetch(`${USER_URL}/me/change-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			current_password: currentPassword,
			new_password: newPassword,
			confirm_password: confirmPassword,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.message || 'Password change failed');
	}

	return data;
}

export async function removeUser(email) {
	const res = await fetch(`${USER_URL}/me`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ email }), 
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.message || 'Failed to delete account');
	}

	return data;
}