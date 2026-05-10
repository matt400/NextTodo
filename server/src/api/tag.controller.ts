import { getUserData } from "./user.service";
import {
  getAllTags,
  getOneTag,
  createTag,
  modifyTag,
  removeTag,
  addTagToTask,
  removeTagFromTask,
  getTasksByTagIds,
} from "./tag.service";

import type { FastifyRequest, FastifyReply } from "fastify";

// Tag CRUD
export async function getTagsController(
  request: FastifyRequest<{
    Querystring: { single?: boolean; tag_id?: number };
  }>,
  reply: FastifyReply,
) {
  const { single, tag_id } = request.query;

  const userData = await getUserData(request.server.prisma, request.user.email);

  if (single) {
    if (!tag_id) return reply.fail("TAG_ID_REQUIRED");
    const tag = await getOneTag(request.server.prisma, userData.id, tag_id);
    return reply.code(200).send([tag]);
  }

  const tags = await getAllTags(request.server.prisma, userData.id);
  return reply.code(200).send(tags);
}

export async function createTagController(
  request: FastifyRequest<{
    Body: { name: string; color: string };
  }>,
  reply: FastifyReply,
) {
  const { name, color } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await createTag(request.server.prisma, userData.id, name, color);

  return reply.ok("TAG_CREATED");
}

export async function modifyTagController(
  request: FastifyRequest<{
    Body: { tag_id: number; data: Partial<{ name: string; color: string }> };
  }>,
  reply: FastifyReply,
) {
  const { tag_id, data } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await modifyTag(request.server.prisma, userData.id, tag_id, data);

  return reply.ok("TAG_MODIFIED");
}

export async function removeTagController(
  request: FastifyRequest<{
    Body: { tag_id: number };
  }>,
  reply: FastifyReply,
) {
  const { tag_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await removeTag(request.server.prisma, userData.id, tag_id);

  return reply.ok("TAG_REMOVED");
}

// Tag <-> Task assignment
export async function addTagToTaskController(
  request: FastifyRequest<{
    Body: { task_id: number; tag_id: number };
  }>,
  reply: FastifyReply,
) {
  const { task_id, tag_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await addTagToTask(request.server.prisma, userData.id, task_id, tag_id);

  return reply.ok("TAG_ADDED_TO_TASK");
}

export async function removeTagFromTaskController(
  request: FastifyRequest<{
    Body: { task_id: number; tag_id: number };
  }>,
  reply: FastifyReply,
) {
  const { task_id, tag_id } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  await removeTagFromTask(request.server.prisma, userData.id, task_id, tag_id);

  return reply.ok("TAG_REMOVED_FROM_TASK");
}

// Filtering
export async function getTasksByTagsController(
  request: FastifyRequest<{
    Querystring: { tag_ids: number[] };
  }>,
  reply: FastifyReply,
) {
  const { tag_ids } = request.query;

  const userData = await getUserData(request.server.prisma, request.user.email);
  const tasks = await getTasksByTagIds(
    request.server.prisma,
    userData.id,
    tag_ids,
  );

  return reply.code(200).send(tasks);
}
