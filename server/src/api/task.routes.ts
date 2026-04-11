import {
  addTaskController,
  getTasksController,
  modifyTaskController,
  removeTaskController,
  getPomoController,
  getPomoHistoryController,
  deletePomoRecordController,
  startPomoController,
  pausePomoController,
  resumePomoController,
  endPomoController,
} from "./task.controller";

import {
  getTaskSchema,
  addTaskSchema,
  modfiyTaskSchema,
  removeTaskSchema,
  getPomoSchema,
  getPomoHistorySchema,
  deletePomoRecordSchema,
  startPomoSchema,
  pausePomoSchema,
  resumePomoSchema,
  endPomoSchema,
} from "./task.schema";

import type { FastifyInstance } from "fastify";

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getTaskSchema,
    },
    getTasksController,
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: addTaskSchema,
    },
    addTaskController,
  );

  fastify.patch(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: modfiyTaskSchema,
    },
    modifyTaskController,
  );

  fastify.delete(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: removeTaskSchema,
    },
    removeTaskController,
  );

  fastify.delete(
    "/pomoHistory",
    {
      preHandler: [fastify.userAccessOnly],
      schema: deletePomoRecordSchema,
    },
    deletePomoRecordController,
  );

  fastify.get(
    "/pomoHistory",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getPomoHistorySchema,
    },
    getPomoHistoryController,
  );

  fastify.post(
    "/getPomo",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getPomoSchema,
    },
    getPomoController,
  );

  fastify.post(
    "/startPomo",
    {
      preHandler: [fastify.userAccessOnly],
      schema: startPomoSchema,
    },
    startPomoController,
  );

  fastify.post(
    "/pausePomo",
    {
      preHandler: [fastify.userAccessOnly],
      schema: pausePomoSchema,
    },
    pausePomoController,
  );

  fastify.post(
    "/resumePomo",
    {
      preHandler: [fastify.userAccessOnly],
      schema: resumePomoSchema,
    },
    resumePomoController,
  );

  fastify.post(
    "/endPomo",
    {
      preHandler: [fastify.userAccessOnly],
      schema: endPomoSchema,
    },
    endPomoController,
  );
}
