import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
  addTagToTask,
  removeTagFromTask,
  fetchTasksByTags,
} from '../tagApi';

const mockOk = (body: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) });

const mockFail = () =>
  vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve(null) });

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchTags', () => {
  it('returns tag array on success', async () => {
    const tags = [{ id: 1, name: 'urgent', color: '#ef4444' }];
    vi.stubGlobal('fetch', mockOk(tags));

    const result = await fetchTags();
    expect(result).toEqual(tags);
  });

  it('returns empty array on failure', async () => {
    vi.stubGlobal('fetch', mockFail());

    const result = await fetchTags();
    expect(result).toEqual([]);
  });
});

describe('createTag', () => {
  it('sends name and color in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await createTag('urgent', '#ef4444');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ name: 'urgent', color: '#ef4444' });
  });

  it('uses POST method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await createTag('urgent', '#ef4444');

    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });
});

describe('updateTag', () => {
  it('sends tag_id and data wrapper in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await updateTag(3, { name: 'renamed', color: '#3b82f6' });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.tag_id).toBe(3);
    expect(body.data).toEqual({ name: 'renamed', color: '#3b82f6' });
  });

  it('uses PATCH method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await updateTag(3, { name: 'renamed' });

    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH');
  });

  it('allows partial data (name only)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await updateTag(3, { name: 'only-name' });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data).toEqual({ name: 'only-name' });
    expect(body.data.color).toBeUndefined();
  });
});

describe('deleteTag', () => {
  it('sends tag_id in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await deleteTag(5);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.tag_id).toBe(5);
  });

  it('uses DELETE method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await deleteTag(5);

    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
  });
});

describe('addTagToTask', () => {
  it('sends task_id and tag_id in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    await addTagToTask(10, 2);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ task_id: 10, tag_id: 2 });
  });

  it('uses POST method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    await addTagToTask(10, 2);

    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });
});

describe('removeTagFromTask', () => {
  it('sends task_id and tag_id in request body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await removeTagFromTask(10, 2);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ task_id: 10, tag_id: 2 });
  });

  it('uses DELETE method', async () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', mockFetch);

    await removeTagFromTask(10, 2);

    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
  });
});

describe('fetchTasksByTags', () => {
  const serverTask = {
    id: 1,
    taskName: 'Buy milk',
    taskDesc: 'From the store',
    isFinished: false,
    scheduled: null,
    created: '2024-01-01T00:00:00.000Z',
    categoryId: null,
    category: null,
    sortOrder: 0,
    tags: [{ id: 2, name: 'urgent', color: '#ef4444' }],
  };

  it('maps server field names to client field names', async () => {
    vi.stubGlobal('fetch', mockOk([serverTask]));

    const tasks = await fetchTasksByTags([2]);

    expect(tasks[0].title).toBe('Buy milk');
    expect(tasks[0].description).toBe('From the store');
    expect(tasks[0].done).toBe(false);
    expect(tasks[0].tags).toEqual(serverTask.tags);
  });

  it('builds query string with multiple tag_ids', async () => {
    const mockFetch = mockOk([]);
    vi.stubGlobal('fetch', mockFetch);

    await fetchTasksByTags([1, 2, 3]);

    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain('tag_ids=1');
    expect(url).toContain('tag_ids=2');
    expect(url).toContain('tag_ids=3');
  });

  it('returns empty array without fetching when tagIds is empty', async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchTasksByTags([]);

    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns empty array on failure', async () => {
    vi.stubGlobal('fetch', mockFail());

    const result = await fetchTasksByTags([1]);
    expect(result).toEqual([]);
  });
});
