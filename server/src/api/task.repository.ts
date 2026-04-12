import { PrismaClient } from "@prismagl";
import type { TaskModifyData } from "@server/interfaces/ITask";

const tasksRepository = (prisma: PrismaClient) => ({
  getAllTasks: (userId: string) => prisma.tasks.findMany({ where: { userId } }),

  getOneTask: (userId: string, taskId: number) =>
    prisma.tasks.findFirst({ where: { userId: userId, id: taskId } }),

  addTask: (userId: string, taskName: string, taskDesc: string) =>
    prisma.tasks.create({
      data: {
        userId: userId,
        taskName: taskName,
        taskDesc: taskDesc,
      },
    }),

  findUniqueTask: (taskId: number, uId: string) =>
    prisma.tasks.findUnique({
      where: { id: taskId, userId: uId },
    }),

  modifyTaskData: (taskId: number, userId: string, data: TaskModifyData) => {
    const isMultiField = Object.keys(data).length > 1;
    const where = { id: taskId, userId };

    return isMultiField
      ? prisma.tasks.updateMany({ where, data })
      : prisma.tasks.update({ where, data });
  },

  removeTask: (taskId: number[], userId: string) => {
    if (taskId.length > 1)
      return prisma.tasks.deleteMany({
        where: {
          id: { in: taskId },
          userId: userId,
        },
      });
    return prisma.tasks.delete({
      where: {
        id: taskId[0],
        userId: userId,
      },
    });
  },

  getPomo: (taskId: number, userId: string) =>
    prisma.pomo.findMany({
      where: { taskId: taskId, userId: userId },
    }),

  getActivePomo: (taskId: number, userId: string) =>
    prisma.pomo.findFirst({
      where: {
        taskId: taskId,
        userId: userId,
        endedAt: null,
      },
    }),

  createPomo: async (taskId: number, userId: string, duration: number) => {
    return await prisma.pomo.create({
      data: {
        userId: userId,
        taskId: taskId,
        duration: duration,
      },
    });
  },

  modifyPomoData: async (pomoId: string, data: object) => {
    return await prisma.pomo.update({
      where: {
        id: pomoId,
      },
      data: data,
    });
  },

  removePomosFromTask: async (taskId: number) => {
    return await prisma.pomo.deleteMany({
      where: { taskId: taskId },
    });
  },

  deletePomoRecord: async (pomoId: string, userId: string) =>
    await prisma.pomo.deleteMany({
      where: { id: pomoId, userId },
    }),

  getPomoHistory: async (userId: string, limit: number = 5) => {
    const pomos = await prisma.pomo.findMany({
      where: { userId, endedAt: { not: null } },
      orderBy: { endedAt: "desc" },
      take: limit,
    });

    if (pomos.length === 0) return [];

    const taskIds = [...new Set(pomos.map((p) => p.taskId))];
    const tasks = await prisma.tasks.findMany({
      where: { id: { in: taskIds } },
      select: { id: true, taskName: true },
    });

    const taskMap = new Map(tasks.map((t) => [t.id, t.taskName]));

    return pomos.map((p) => ({
      ...p,
      taskName: taskMap.get(p.taskId) ?? "Deleted task",
    }));
  },
});

export default tasksRepository;
