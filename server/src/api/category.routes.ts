import {
  getCategoriesController,
  createCategoryController,
  modifyCategoryController,
  removeCategoryController,
  getCategoryTasksController,
} from "./category.controller";

import {
  getCategorySchema,
  createCategorySchema,
  modifyCategorySchema,
  removeCategorySchema,
  getCategoryTasksSchema,
} from "./category.schema";

import type { FastifyInstance } from "fastify";

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getCategorySchema,
    },
    getCategoriesController,
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: createCategorySchema,
    },
    createCategoryController,
  );

  fastify.patch(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: modifyCategorySchema,
    },
    modifyCategoryController,
  );

  fastify.delete(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
      schema: removeCategorySchema,
    },
    removeCategoryController,
  );

  fastify.get(
    "/tasks",
    {
      preHandler: [fastify.userAccessOnly],
      schema: getCategoryTasksSchema,
    },
    getCategoryTasksController,
  );
}
