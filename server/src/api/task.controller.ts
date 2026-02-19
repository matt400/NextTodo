import { getUserData } from "./user.service";
import { addTask, getAllTasks, getOneTask } from "./task.service";

import type {
  ITaskGetRequest,
  ITaskAddRequest,
} from "@server/interfaces/ITask";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function getTasksController(
  request: FastifyRequest<ITaskGetRequest>,
  reply: FastifyReply,
) {
  const { single, task_id } = request.query ?? {};

  const userData = await getUserData(request.server.prisma, request.user.email);
  if (!userData) return reply.fail("NO_SUCH_USER");

  var results = [];
  if (single) {
    if (!task_id) return reply.fail("TASK_ID_REQUIRED");
    const oneTask = await getOneTask(
      request.server.prisma,
      userData.id,
      task_id,
    );
    results.push(oneTask);
  } else {
    const allTasks = await getAllTasks(request.server.prisma, userData.id);
    results.push(allTasks);
  }
  return JSON.stringify(results.flat());
}

export async function addTaskController(
  request: FastifyRequest<ITaskAddRequest>,
  reply: FastifyReply,
) {
  const { task_name, task_desc } = request.body;

  // Get user data
  const userData = await getUserData(request.server.prisma, request.user.email);
  if (!userData) return reply.fail("NO_SUCH_USER");

  // Add new task
  const newTask = await addTask(
    request.server.prisma,
    userData.id,
    task_name,
    task_desc,
  );

  // Todo: Future: Add log to results from newTask

  return reply.ok("NEW_TASK_ADDED");
}
