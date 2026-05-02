import { AppError, handlePrismaError } from "@server/utils/errors";
import repository from "./task.repository";

import type { PrismaClient } from "@server/generated/prisma/client";
import type { TaskModifyData } from "@server/interfaces/ITask";

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
  data: TaskModifyData,
) {
  try {
    const uniqueTask = await repository(prisma).findUniqueTask(taskId, userId);
    if (!uniqueTask) throw new AppError(404, "TASK_NOT_FOUND");
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
    if ("count" in result && result.count == 0)
      throw new AppError(404, "TASK_REMOVE_ERROR");
    return result;
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getPomo(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
) {
  try {
    return await repository(prisma).getPomos(userId, { taskId });
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function startPomo(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
  duration: number,
) {
  try {
    const activePomo = await repository(prisma).getActivePomo(taskId, userId);
    if (activePomo) {
      return await repository(prisma).modifyPomoData(activePomo?.id, {
        startedAt: new Date(),
        pausedAt: null,
        endedAt: null,
        elapsed: 0,
      });
    }
    return await repository(prisma).createPomo(taskId, userId, duration);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function pauseOrResumePomo(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
  isResume: boolean = false,
) {
  try {
    const activePomo = await repository(prisma).getActivePomo(taskId, userId);
    if (!activePomo) throw new AppError(404, "POMO_NOT_FOUND");

    if (!isResume && activePomo.pausedAt !== null)
      throw new AppError(400, "POMO_ALREADY_PAUSED");
    if (isResume && activePomo.pausedAt === null)
      throw new AppError(400, "POMO_ALREADY_WORKING");

    const currentDate = new Date();

    if (isResume) {
      return await repository(prisma).modifyPomoData(activePomo.id, {
        pausedAt: null,
        startedAt: currentDate,
      });
    }

    const elapsed =
      activePomo.elapsed +
      (currentDate.getTime() - activePomo.startedAt.getTime());

    return await repository(prisma).modifyPomoData(activePomo.id, {
      pausedAt: currentDate,
      elapsed,
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function deletePomoRecord(
  prisma: PrismaClient,
  pomoId: string,
  userId: string,
) {
  try {
    return await repository(prisma).deletePomoRecord(pomoId, userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getPomoHistory(prisma: PrismaClient, userId: string) {
  try {
    return await repository(prisma).getPomos(userId, {
      historyOnly: true,
      limit: 5,
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function reorderTasks(
  prisma: PrismaClient,
  userId: string,
  items: { taskId: number; sortOrder: number }[],
) {
  try {
    return await repository(prisma).reorderTasks(userId, items);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function endPomo(
  prisma: PrismaClient,
  taskId: number,
  userId: string,
) {
  try {
    const activePomo = await repository(prisma).getActivePomo(taskId, userId);
    if (!activePomo) throw new AppError(404, "POMO_NOT_FOUND");

    const now = new Date();
    const runningMs = !activePomo.pausedAt
      ? now.getTime() - activePomo.startedAt.getTime()
      : 0;

    return await repository(prisma).modifyPomoData(activePomo.id, {
      pausedAt: null,
      elapsed: activePomo.elapsed + runningMs,
      endedAt: now,
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}
