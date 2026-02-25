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
    // Todo: Future log
    console.log(err);
    throw err;
  }
}

export async function getAllTasks(prisma: PrismaClient, userId: string) {
  try {
    return await repository(prisma).getAllTasks(userId);
  } catch (err) {
    // Todo: Future log
    console.log(err);
    throw err;
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
    // Todo: Future log
    console.log(err);
    throw err;
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
    // Todo: Future log
    console.log(err);
    return err;
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
      throw Error("Nothing was deleted");
    return result;
  } catch (err) {
    // Todo: Future log
    console.log(err);
    return err;
  }
}
