import type { Task, PomoData, PomoRecord, Tag } from '../types';

const API = `${import.meta.env.VITE_API_URL}/api/task`;

interface ServerTask {
  id: number;
  taskName: string;
  taskDesc: string;
  isFinished: boolean;
  scheduled: string | null;
  created: string;
  categoryId?: number | null;
  category?: import('../types').Category | null;
  sortOrder?: number;
  tags?: Tag[];
}

interface TaskUpdate {
  title?: string;
  description?: string;
  scheduled?: string | null;
  isFinished?: boolean;
  categoryId?: number | null;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API, {
    method: 'GET',
    credentials: 'include',
  });

  const data = (await res.json()) as ServerTask[];

  return data.map((task) => ({
    id: task.id,
    title: task.taskName,
    description: task.taskDesc,
    done: task.isFinished,
    scheduled: task.scheduled,
    created: task.created,
    categoryId: task.categoryId ?? null,
    category: task.category ?? null,
    sortOrder: task.sortOrder ?? 0,
    tags: task.tags ?? [],
  }));
}

export async function addTask(title: string, description: string): Promise<{ id: number } | null> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      task_name: title,
      task_desc: description,
    }),
  });
  try {
    return (await res.json()) as { id: number };
  } catch {
    return null;
  }
}

export async function editTask(id: number, updates: TaskUpdate): Promise<void> {
  const mapped = {
    ...(updates.title !== undefined && { taskName: updates.title }),
    ...(updates.description !== undefined && { taskDesc: updates.description }),
    ...(updates.scheduled !== undefined && { scheduled: updates.scheduled }),
    ...(updates.isFinished !== undefined && { isFinished: updates.isFinished }),
    ...(updates.categoryId !== undefined && { categoryId: updates.categoryId }),
  };

  await fetch(API, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      task_id: id,
      data: mapped,
    }),
  });
}

export async function reorderTasks(items: { id: number; sortOrder: number }[]): Promise<void> {
  await fetch(`${API}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      items: items.map((i) => ({ task_id: i.id, sort_order: i.sortOrder })),
    }),
  });
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      task_id: id,
    }),
  });
}

export async function getPomodoro(taskId: number): Promise<PomoData | null> {
  if (!taskId) return null;
  const res = await fetch(`${API}/getPomo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) return null;
  try {
    const data = (await res.json()) as PomoData[];
    if (!Array.isArray(data)) return null;
    return data.find((p) => p.endedAt === null) ?? null;
  } catch {
    return null;
  }
}

export async function startPomodoro(taskId: number, minutes = 25): Promise<PomoData | null> {
  const duration = minutes * 60;
  const id = parseInt(String(taskId), 10);

  const res = await fetch(`${API}/startPomo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: id, duration }),
  });

  if (!res.ok) return null;

  localStorage.setItem('activePomodoroTaskId', String(id));
  return res.json() as Promise<PomoData>;
}

export async function pausePomodoro(taskId: number): Promise<PomoData | null> {
  const res = await fetch(`${API}/pausePomo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) return null;
  return res.json() as Promise<PomoData>;
}

export async function resumePomodoro(taskId: number): Promise<PomoData | null> {
  const res = await fetch(`${API}/resumePomo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) return null;
  return res.json() as Promise<PomoData>;
}

export async function deletePomoRecord(pomoId: number): Promise<unknown> {
  const res = await fetch(`${API}/pomoHistory`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ pomo_id: pomoId }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPomoHistory(): Promise<PomoRecord[]> {
  const res = await fetch(`${API}/pomoHistory`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) return [];
  try {
    return (await res.json()) as PomoRecord[];
  } catch {
    return [];
  }
}

export async function endPomodoro(taskId: number): Promise<unknown> {
  const res = await fetch(`${API}/endPomo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_id: taskId }),
  });
  localStorage.removeItem('activePomodoroTaskId');
  if (!res.ok) return null;
  return res.json();
}
