import {
  addTaskController,
  getTasksController,
  modifyTaskController,
  removeTaskController,
} from "./task.controller";

import {
  getTaskSchema,
  addTaskSchema,
  modfiyTaskSchema,
  removeTaskSchema,
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
}
