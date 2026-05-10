import {
  getTagsController,
  createTagController,
  modifyTagController,
  removeTagController,
  addTagToTaskController,
  removeTagFromTaskController,
  getTasksByTagsController,
} from "./tag.controller";

import {
  getTagSchema,
  createTagSchema,
  modifyTagSchema,
  removeTagSchema,
  addTagToTaskSchema,
  removeTagFromTaskSchema,
  getTasksByTagsSchema,
} from "./tag.schema";

import type { FastifyInstance } from "fastify";

export default async function tagRoutes(fastify: FastifyInstance) {
  // Tag CRUD
  fastify.get(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getTagSchema,
    },
    getTagsController,
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: createTagSchema,
    },
    createTagController,
  );

  fastify.patch(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: modifyTagSchema,
    },
    modifyTagController,
  );

  fastify.delete(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: removeTagSchema,
    },
    removeTagController,
  );

  // Tag <-> Task assignment
  fastify.post(
    "/tasks",
    {
      preHandler: [fastify.userAccessOnly],
      schema: addTagToTaskSchema,
    },
    addTagToTaskController,
  );

  fastify.delete(
    "/tasks",
    {
      preHandler: [fastify.userAccessOnly],
      schema: removeTagFromTaskSchema,
    },
    removeTagFromTaskController,
  );

  // Filtering
  fastify.get(
    "/tasks",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getTasksByTagsSchema,
    },
    getTasksByTagsController,
  );
}
