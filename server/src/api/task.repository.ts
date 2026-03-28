import { PrismaClient } from "@prismagl";
import { AppError } from "@server/utils/errors";

const tasksRepository = (prisma: PrismaClient) => {
  const repo = {
    getAllTasks: async (userId: string) =>
      await prisma.tasks.findMany({ where: { userId } }),

    getOneTask: async (userId: string, taskId: number) =>
      await prisma.tasks.findFirst({ where: { userId: userId, id: taskId } }),

    addTask: async (userId: string, taskName: string, taskDesc: string) =>
      await prisma.tasks.create({
        data: {
          userId: userId,
          taskName: taskName,
          taskDesc: taskDesc,
        },
      }),

    findUniqueTask: async (taskId: number, uId: string) => {
      const task = await prisma.tasks.findUnique({
        where: { id: taskId, userId: uId },
      });
      if (!task) throw new AppError(404, "TASK_NOT_FOUND");
      return task;
    },

    modifyTaskData: async (taskId: number, userId: string, data: object) => {
      await repo.findUniqueTask(taskId, userId);

      if (Object.keys(data).length > 1)
        return await prisma.tasks.updateMany({
          where: { id: taskId, userId: userId },
          data: data,
        });
      else
        return await prisma.tasks.update({
          where: { id: taskId, userId: userId },
          data: data,
        });
    },

    removeTask: async (taskId: number[], userId: string) => {
      if (taskId.length > 1)
        return await prisma.tasks.deleteMany({
          where: {
            userId: userId,
            id: { in: taskId },
          },
        });
      return await prisma.tasks.delete({
        where: {
          userId: userId,
          id: taskId[0],
        },
      });
    },

    getPomo: async (taskId: number, userId: string) =>
      await prisma.pomo.findMany({
        where: { userId: userId, taskId: taskId },
      }),

    startPomo: async (taskId: number, userId: string, duration: number) => {
      const numberOfRecords = await prisma.pomo.count({
        where: {
          taskId: taskId,
        },
      });
      if (numberOfRecords > 0) throw new AppError(400, "POMO_IS_STARTED");

      return await prisma.pomo.create({
        data: {
          userId: userId,
          taskId: taskId,
          duration: duration,
        },
      });
    },

    pausePomo: async (
      pomoId: string,
      taskId: number,
      userId: string,
      elapsed: number,
    ) => {
      return await prisma.pomo.update({
        where: {
          id: pomoId,
          taskId: taskId,
          userId: userId,
        },
        data: {
          elapsed: elapsed,
        },
      });
    },

    resumePomo: async (taskId: number, userId: string) => {},

    endPomo: async (taskId: number, userId: string) => {},
  };
  return repo;
};

export default tasksRepository;
