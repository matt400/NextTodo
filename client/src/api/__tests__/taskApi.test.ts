import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTasks, addTask, editTask, deleteTask } from '../taskApi';

// Fake server response shape (what the backend actually sends)
const serverTask = {
  id: 1,
  taskName: 'Buy milk',
  taskDesc: 'From the corner store',
  isFinished: false,
  scheduled: null,
  created: '2024-01-01T00:00:00.000Z',
};

// What our client Task type expects after mapping
const clientTask = {
  id: 1,
  title: 'Buy milk',
  description: 'From the corner store',
  done: false,
  scheduled: null,
  created: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchTasks', () => {
  it('maps server field names to client field names', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve([serverTask]),
      })
    );

    const tasks = await fetchTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(clientTask);
  });

  it('maps isFinished → done correctly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve([{ ...serverTask, isFinished: true }]),
      })
    );

    const tasks = await fetchTasks();
    expect(tasks[0].done).toBe(true);
  });

  it('returns empty array when server returns no tasks', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve([]),
      })
    );

    const tasks = await fetchTasks();
    expect(tasks).toEqual([]);
  });
});

describe('addTask', () => {
  it('sends task_name and task_desc in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await addTask('Buy milk', 'From the corner store');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ task_name: 'Buy milk', task_desc: 'From the corner store' });
  });

  it('uses POST method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await addTask('Test', '');

    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });
});

describe('editTask', () => {
  it('maps title → taskName and description → taskDesc', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await editTask(42, { title: 'New title', description: 'New desc' });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.task_id).toBe(42);
    expect(body.data).toEqual({ taskName: 'New title', taskDesc: 'New desc' });
  });

  it('omits fields that are not provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await editTask(1, { isFinished: true });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data).toEqual({ isFinished: true });
    expect(body.data.taskName).toBeUndefined();
  });
});

describe('deleteTask', () => {
  it('sends task_id in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await deleteTask(7);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.task_id).toBe(7);
  });
});
