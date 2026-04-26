import type { User, UserSettings } from '../types';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const AUTH_URL = API_URL + '/auth';
const USER_URL = API_URL + '/user';

export async function register(
  username: string,
  email: string,
  password: string,
  confirm_password: string
): Promise<unknown> {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password, confirm_password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error((err as { message?: string }).message || 'Registration failed');
  }

  return res.json();
}

export async function login(email: string, password: string): Promise<unknown> {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error((err as { message?: string }).message || 'Login failed');
  }

  return res.json();
}

export async function getMe(): Promise<User | null> {
  const res = await fetch(`${USER_URL}/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (res.status !== 200) return null;
  return res.json() as Promise<User>;
}

export async function logout(): Promise<Response> {
  return fetch(`${USER_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<unknown> {
  const res = await fetch(`${USER_URL}/me/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as { message?: string })?.message || 'Password change failed');
  }

  return data;
}

export async function updateUserData(data: Record<string, unknown>): Promise<User> {
  const res = await fetch(`${USER_URL}/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error((json as { message?: string })?.message || 'Update failed');
  }

  return json as User;
}

export async function removeUser(email: string): Promise<unknown> {
  const res = await fetch(`${USER_URL}/me`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as { message?: string })?.message || 'Failed to delete account');
  }

  return data;
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<unknown> {
  const res = await fetch(`${USER_URL}/me/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userSettings: settings }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as { message?: string })?.message || 'Settings update failed');
  }

  return data;
}
