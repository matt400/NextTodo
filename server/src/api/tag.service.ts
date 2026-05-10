import { AppError, handlePrismaError } from "@server/utils/errors";
import tagRepo from "./tag.repository";
import tasksRepo from "./task.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

const MAX_TAGS_PER_TASK = 10;

export async function getAllTags(prisma: PrismaClient, userId: string) {
  try {
    return await tagRepo(prisma).getAllTags(userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getOneTag(
  prisma: PrismaClient,
  userId: string,
  tagId: number,
) {
  try {
    const tag = await tagRepo(prisma).getOneTag(tagId, userId);
    if (!tag) throw new AppError(404, "TAG_NOT_FOUND");
    return tag;
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function createTag(
  prisma: PrismaClient,
  userId: string,
  name: string,
  color: string,
) {
  try {
    return await tagRepo(prisma).createTag(userId, name, color);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function modifyTag(
  prisma: PrismaClient,
  userId: string,
  tagId: number,
  data: Partial<{ name: string; color: string }>,
) {
  try {
    const exists = await tagRepo(prisma).tagExists(tagId, userId);
    if (!exists) throw new AppError(404, "TAG_NOT_FOUND");
    return await tagRepo(prisma).modifyTag(tagId, userId, data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function removeTag(
  prisma: PrismaClient,
  userId: string,
  tagId: number,
) {
  try {
    const exists = await tagRepo(prisma).tagExists(tagId, userId);
    if (!exists) throw new AppError(404, "TAG_NOT_FOUND");
    // Prisma will automatically disconnect the tag from all tasks on delete
    return await tagRepo(prisma).removeTag(tagId, userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function addTagToTask(
  prisma: PrismaClient,
  userId: string,
  taskId: number,
  tagId: number,
) {
  try {
    // Both tag and task must belong to the requesting user
    const [tag, task] = await Promise.all([
      tagRepo(prisma).tagExists(tagId, userId),
      tasksRepo(prisma).findUniqueTask(taskId, userId),
    ]);

    if (!tag) throw new AppError(404, "TAG_NOT_FOUND");
    if (!task) throw new AppError(404, "TASK_NOT_FOUND");

    const taskWithTags = await tagRepo(prisma).getTagsOnTask(taskId);
    const currentTags = taskWithTags?.tags ?? [];

    if (currentTags.some((t) => t.id === tagId))
      throw new AppError(409, "TAG_ALREADY_ON_TASK");

    if (currentTags.length >= MAX_TAGS_PER_TASK)
      throw new AppError(400, "TAG_LIMIT_REACHED");

    return await tagRepo(prisma).addTagToTask(taskId, tagId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function removeTagFromTask(
  prisma: PrismaClient,
  userId: string,
  taskId: number,
  tagId: number,
) {
  try {
    const [tag, task] = await Promise.all([
      tagRepo(prisma).tagExists(tagId, userId),
      tasksRepo(prisma).findUniqueTask(taskId, userId),
    ]);

    if (!tag) throw new AppError(404, "TAG_NOT_FOUND");
    if (!task) throw new AppError(404, "TASK_NOT_FOUND");

    return await tagRepo(prisma).removeTagFromTask(taskId, tagId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getTasksByTagIds(
  prisma: PrismaClient,
  userId: string,
  tagIds: number[],
) {
  try {
    return await tagRepo(prisma).getTasksByTagIds(userId, tagIds);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}
