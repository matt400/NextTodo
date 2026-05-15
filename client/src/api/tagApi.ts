import type { Category, Tag, Task } from '../types';

const API = `${import.meta.env.VITE_API_URL}/api/tags`;

interface ServerTask {
  id: number;
  taskName: string;
  taskDesc: string;
  isFinished: boolean;
  scheduled: string | null;
  created: string;
  categoryId: number | null;
  category: Category | null;
  sortOrder?: number;
  tags?: Tag[];
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(API, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) return [];
  return res.json() as Promise<Tag[]>;
}

export async function createTag(name: string, color: string): Promise<void> {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, color }),
  });
}

export async function updateTag(
  tagId: number,
  data: Partial<{ name: string; color: string }>,
): Promise<void> {
  await fetch(API, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ tag_id: tagId, data }),
  });
}

export async function deleteTag(tagId: number): Promise<void> {
  await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ tag_id: tagId }),
  });
}

export async function addTagToTask(taskId: number, tagId: number): Promise<Response> {
  return fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId, tag_id: tagId }),
  });
}

export async function removeTagFromTask(taskId: number, tagId: number): Promise<void> {
  await fetch(`${API}/tasks`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId, tag_id: tagId }),
  });
}

export async function fetchTasksByTags(tagIds: number[]): Promise<Task[]> {
  if (tagIds.length === 0) return [];
  const qs = tagIds.map((id) => `tag_ids=${id}`).join('&');
  const res = await fetch(`${API}/tasks?${qs}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = (await res.json()) as ServerTask[];
  return data.map((task) => ({
    id: task.id,
    title: task.taskName,
    description: task.taskDesc,
    done: task.isFinished,
    scheduled: task.scheduled,
    created: task.created,
    categoryId: task.categoryId,
    category: task.category,
    sortOrder: task.sortOrder ?? 0,
    tags: task.tags ?? [],
  }));
}
