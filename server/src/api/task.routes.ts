import { addTaskController, getTasksController } from "./task.controller";
import { getTaskSchema, addTaskSchema } from "./task.schema";

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
  fastify.delete(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
  fastify.patch(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
}
