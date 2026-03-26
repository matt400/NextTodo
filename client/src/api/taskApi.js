const API = 'http://localhost:3000/api/task';

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
	await fetch(API, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({
			task_id: id,
			data: updates,
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
