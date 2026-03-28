import { getUserData } from "./user.service";
import {
  addTask,
  getAllTasks,
  getOneTask,
  modifyTaskData,
  removeTask,
  managePomo,
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
} from "@server/interfaces/ITask";

import { PomoMethod } from "./task.service";
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

  const data = await managePomo(
    request.server.prisma,
    task_id,
    userData.id,
    PomoMethod.Get,
  );

  return reply.code(200).send(data);
}

export async function startPomoController(
  request: FastifyRequest<IStartPomoRequest>,
  reply: FastifyReply,
) {
  const { task_id, duration } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await managePomo(
    request.server.prisma,
    task_id,
    userData.id,
    PomoMethod.Start,
    undefined,
    duration,
  );

  return reply.ok("POMO_STARTED");
}

export async function pausePomoController(
  request: FastifyRequest<IPausePomoRequest>,
  reply: FastifyReply,
) {
  const { pomo_id, task_id, elapsed } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);

  await managePomo(
    request.server.prisma,
    task_id,
    userData.id,
    PomoMethod.Pause,
    pomo_id,
    elapsed,
  );
}

export async function resumePomoController(
  request: FastifyRequest<IResumePomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await managePomo(
    request.server.prisma,
    task_id,
    userData.id,
    PomoMethod.Resume,
  );
}

export async function endPomoController(
  request: FastifyRequest<IEndPomoRequest>,
  reply: FastifyReply,
) {
  const { task_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await managePomo(request.server.prisma, task_id, userData.id, PomoMethod.End);
}
