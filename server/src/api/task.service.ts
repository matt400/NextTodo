import { AppError, handlePrismaError } from "@server/utils/errors";
import repository from "./task.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

export async function getOneTask(
  prisma: PrismaClient,
  userId: string,
  taskId: number,
) {
  try {
    return await repository(prisma).getOneTask(userId, taskId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getAllTasks(prisma: PrismaClient, userId: string) {
  try {
    return await repository(prisma).getAllTasks(userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function addTask(
  prisma: PrismaClient,
  userId: string,
  taskName: string,
  taskDesc: string,
) {
  try {
    return await repository(prisma).addTask(userId, taskName, taskDesc);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function modifyTaskData(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
  data: object,
) {
  try {
    return await repository(prisma).modifyTaskData(taskId, userId, data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function removeTask(
  prisma: PrismaClient,
  taskId: number[],
  userId: string,
) {
  try {
    const result = await repository(prisma).removeTask(taskId, userId);
    const getCount = JSON.parse(JSON.stringify(result));
    if ("count" in getCount && getCount.count == 0)
      throw new AppError(404, "TASK_REMOVE_ERROR");
    return result;
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export enum PomoMethod {
  Get,
  Start,
  Pause,
  Resume,
  End,
}

export async function managePomo(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
  type: PomoMethod,
  pomoId: string = "",
  durationOrElapsed: number = 0,
) {
  try {
    switch (type) {
      case PomoMethod.Get:
        return await repository(prisma).getPomo(taskId, userId);
      case PomoMethod.Start:
        return await repository(prisma).startPomo(
          taskId,
          userId,
          durationOrElapsed,
        );
      case PomoMethod.Pause:
        return await repository(prisma).pausePomo(
          pomoId,
          taskId,
          userId,
          durationOrElapsed,
        );
      case PomoMethod.Resume:
        return await repository(prisma).resumePomo(taskId, userId);
      case PomoMethod.End:
        return await repository(prisma).endPomo(taskId, userId);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}
