import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register, getMe } from '../auth';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('login', () => {
  it('throws with the server error message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    await expect(login('bad@email.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
  });

  it('throws a fallback message when server sends no message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    await expect(login('a@b.com', 'pass')).rejects.toThrow('Login failed');
  });

  it('sends email and password in the request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: {} }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await login('user@test.com', 'secret');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ email: 'user@test.com', password: 'secret' });
  });
});

describe('register', () => {
  it('throws with the server error message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already in use' }),
      })
    );

    await expect(register('pavel', 'taken@email.com', 'pass', 'pass')).rejects.toThrow(
      'Email already in use'
    );
  });

  it('sends all four fields in the request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    await register('pavel', 'p@test.com', 'pass123', 'pass123');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({
      username: 'pavel',
      email: 'p@test.com',
      password: 'pass123',
      confirm_password: 'pass123',
    });
  });
});

describe('getMe', () => {
  it('returns null when the server responds with non-200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 401,
        json: () => Promise.resolve(null),
      })
    );

    const result = await getMe();
    expect(result).toBeNull();
  });

  it('returns the user object on success', async () => {
    const user = { id: 1, username: 'pavel', email: 'p@test.com' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve(user),
      })
    );

    const result = await getMe();
    expect(result).toEqual(user);
  });
});
