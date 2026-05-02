import type { Category, Task } from '../types';

const API = `${import.meta.env.VITE_API_URL}/api/category`;

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
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) return [];
  return res.json() as Promise<Category[]>;
}

export async function createCategory(name: string, color: string, icon: string): Promise<void> {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, color, icon }),
  });
}

export async function updateCategory(
  categoryId: number,
  data: Partial<{ name: string; color: string; icon: string }>,
): Promise<void> {
  await fetch(API, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ category_id: categoryId, data }),
  });
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ category_id: categoryId }),
  });
}

export async function fetchTasksByCategory(categoryId: number): Promise<Task[]> {
  const res = await fetch(`${API}/tasks?category_id=${categoryId}`, {
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
  }));
}
