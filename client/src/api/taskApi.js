const API = `${import.meta.env.VITE_API_URL}/api/task`;

export async function fetchTasks() {
	const res = await fetch(API, {
		method: 'GET',
		credentials: 'include',
	});

	const data = await res.json();

	return data.map((task) => ({
		id: task.id,
		title: task.taskName,
		description: task.taskDesc,
		done: task.isFinished,
		scheduled: task.scheduled,
		created: task.created,
	}));
}

export async function addTask(title, description) {
	await fetch(API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({
			task_name: title,
			task_desc: description,
		}),
	});
}

export async function editTask(id, updates) {
	const mapped = {
		...(updates.title !== undefined && { taskName: updates.title }),
		...(updates.description !== undefined && { taskDesc: updates.description }),
		...(updates.scheduled !== undefined && { scheduled: updates.scheduled }),
		...(updates.isFinished !== undefined && { isFinished: updates.isFinished }),
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

export async function deleteTask(id) {
	await fetch(API, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({
			task_id: id,
		}),
	});
}

export async function getPomodoro(taskId) {
	if (!taskId) return null;
	const res = await fetch(`${API}/getPomo`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ task_id: taskId }),
	});
	if (!res.ok) return null;
	try {
		const data = await res.json();
		if (!Array.isArray(data)) return null;
		return data.find((p) => p.endedAt === null) ?? null;
	} catch {
		return null;
	}
}

export async function startPomodoro(taskId) {
	const rawMinutes = parseInt(localStorage.getItem('pomodoroTime'), 10);
	const minutes = Number.isFinite(rawMinutes) && rawMinutes > 0 ? rawMinutes : 25;
	const duration = minutes * 60;
	const id = parseInt(taskId, 10);

	const res = await fetch(`${API}/startPomo`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ task_id: id, duration }),
	});

	if (!res.ok) return null;

	localStorage.setItem('activePomodoroTaskId', String(id));
	return res.json();
}

export async function pausePomodoro(taskId) {
	const res = await fetch(`${API}/pausePomo`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ task_id: taskId }),
	});
	if (!res.ok) return null;
	return res.json();
}

export async function resumePomodoro(taskId) {
	const res = await fetch(`${API}/resumePomo`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ task_id: taskId }),
	});
	if (!res.ok) return null;
	return res.json();
}

export async function deletePomoRecord(pomoId) {
	const res = await fetch(`${API}/pomoHistory`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ pomo_id: pomoId }),
	});
	if (!res.ok) return null;
	return res.json();
}

export async function fetchPomoHistory() {
	const res = await fetch(`${API}/pomoHistory`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!res.ok) return [];
	try {
		return await res.json();
	} catch {
		return [];
	}
}

export async function endPomodoro(taskId) {
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
