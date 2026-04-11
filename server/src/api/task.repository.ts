import { PrismaClient } from "@prismagl";

const tasksRepository = (prisma: PrismaClient) => ({
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

  findUniqueTask: async (taskId: number, uId: string) =>
    await prisma.tasks.findUnique({
      where: { id: taskId, userId: uId },
    }),

  modifyTaskData: async (taskId: number, userId: string, data: object) => {
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
          id: { in: taskId },
          userId: userId,
        },
      });
    return await prisma.tasks.delete({
      where: {
        id: taskId[0],
        userId: userId,
      },
    });
  },

  getPomo: async (taskId: number, userId: string) =>
    await prisma.pomo.findMany({
      where: { taskId: taskId, userId: userId },
    }),

  getActivePomo: async (taskId: number, userId: string) =>
    await prisma.pomo.findFirst({
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
