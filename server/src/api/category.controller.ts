import { getUserData } from "./user.service";
import {
  getAllCategories,
  getOneCategory,
  createCategory,
  modifyCategory,
  removeCategory,
  getTasksByCategory,
} from "./category.service";

import type {
  ICategoryGetRequest,
  ICategoryGetTasksRequest,
  ICategoryCreateRequest,
  ICategoryModifyRequest,
  ICategoryRemoveRequest,
} from "@server/interfaces/ICategory";

import type { FastifyRequest, FastifyReply } from "fastify";

export async function getCategoriesController(
  request: FastifyRequest<ICategoryGetRequest>,
  reply: FastifyReply,
) {
  const { single, category_id } = request.query;

  const userData = await getUserData(request.server.prisma, request.user.email);

  if (single) {
    if (!category_id) return reply.fail("CATEGORY_ID_REQUIRED");
    const category = await getOneCategory(
      request.server.prisma,
      userData.id,
      category_id,
    );
    return reply.code(200).send([category]);
  }

  const categories = await getAllCategories(request.server.prisma, userData.id);
  return reply.code(200).send(categories);
}

export async function createCategoryController(
  request: FastifyRequest<ICategoryCreateRequest>,
  reply: FastifyReply,
) {
  const { name, color, icon } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await createCategory(request.server.prisma, userData.id, name, color, icon);

  return reply.ok("CATEGORY_CREATED");
}

export async function modifyCategoryController(
  request: FastifyRequest<ICategoryModifyRequest>,
  reply: FastifyReply,
) {
  const { category_id, data } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await modifyCategory(request.server.prisma, userData.id, category_id, data);

  return reply.ok("CATEGORY_MODIFIED");
}

export async function removeCategoryController(
  request: FastifyRequest<ICategoryRemoveRequest>,
  reply: FastifyReply,
) {
  const { category_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await removeCategory(request.server.prisma, userData.id, category_id);

  return reply.ok("CATEGORY_REMOVED");
}

export async function getCategoryTasksController(
  request: FastifyRequest<ICategoryGetTasksRequest>,
  reply: FastifyReply,
) {
  const { category_id } = request.query;

  const userData = await getUserData(request.server.prisma, request.user.email);
  const tasks = await getTasksByCategory(
    request.server.prisma,
    userData.id,
    category_id,
  );

  return reply.code(200).send(tasks);
}
