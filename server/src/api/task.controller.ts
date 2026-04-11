import { getUserData } from "./user.service";
import {
  addTask,
  getAllTasks,
  getOneTask,
  modifyTaskData,
  removeTask,
  getPomo,
  getPomoHistory,
  deletePomoRecord,
  startPomo,
  pauseOrResumePomo,
  endPomo,
} from "./task.service";

import type {
  ITaskGetRequest,
  ITaskAddRequest,
  ITaskModifyRequest,
  ITaskRemoveRequest,
  IGetPomoRequest,
  IStartPomoRequest,
  IPausePomoRequest,
  IResumePomoRequest,
  IEndPomoRequest,
  IGetPomoHistoryRequest,
  IDeletePomoRecordRequest,
} from "@server/interfaces/ITask";

import type { FastifyRequest, FastifyReply } from "fastify";

export async function getTasksController(
  request: FastifyRequest<ITaskGetRequest>,
  reply: FastifyReply,
) {
  const { single, task_id } = request.query ?? {};

  const userData = await getUserData(request.server.prisma, request.user.email);

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

  const userData = await getUserData(request.server.prisma, request.user.email);
  await addTask(request.server.prisma, userData.id, task_name, task_desc);

  return reply.ok("NEW_TASK_ADDED");
}

export async function modifyTaskController(
  request: FastifyRequest<ITaskModifyRequest>,
  reply: FastifyReply,
) {
  const { task_id, data } = request.body;
  const userData = await getUserData(request.server.prisma, request.user.email);

  await modifyTaskData(request.server.prisma, task_id, userData.id, data);

  return reply.ok("TASK_MODIFIED");
}

export async function removeTaskController(
  request: FastifyRequest<ITaskRemoveRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await removeTask(request.server.prisma, task_id, userData.id);

  return reply.ok("TASK_REMOVE_SUCCESS");
}

export async function getPomoController(
  request: FastifyRequest<IGetPomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  const data = await getPomo(request.server.prisma, task_id, userData.id);

  return reply.code(200).send(data);
}

export async function startPomoController(
  request: FastifyRequest<IStartPomoRequest>,
  reply: FastifyReply,
) {
  const { task_id, duration } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await startPomo(request.server.prisma, task_id, userData.id, duration);

  return reply.ok("POMO_STARTED");
}

export async function pausePomoController(
  request: FastifyRequest<IPausePomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await pauseOrResumePomo(request.server.prisma, task_id, userData.id);

  return reply.ok("POMO_PAUSED", userData);
}

export async function resumePomoController(
  request: FastifyRequest<IResumePomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await pauseOrResumePomo(request.server.prisma, task_id, userData.id, true);

  return reply.ok("POMO_RESUMED", userData);
}

export async function deletePomoRecordController(
  request: FastifyRequest<IDeletePomoRecordRequest>,
  reply: FastifyReply,
) {
  const { pomo_id } = request.body;
  const userData = await getUserData(request.server.prisma, request.user.email);
  await deletePomoRecord(request.server.prisma, pomo_id, userData.id);
  return reply.ok("POMO_RECORD_DELETED");
}

export async function getPomoHistoryController(
  request: FastifyRequest<IGetPomoHistoryRequest>,
  reply: FastifyReply,
) {
  const userData = await getUserData(request.server.prisma, request.user.email);
  const data = await getPomoHistory(request.server.prisma, userData.id);
  return reply.code(200).send(data);
}

export async function endPomoController(
  request: FastifyRequest<IEndPomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await endPomo(request.server.prisma, task_id, userData.id);

  return reply.ok("POMO_ENDED");
}
