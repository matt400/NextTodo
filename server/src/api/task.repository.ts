import { PrismaClient } from "@prismagl";
import type { TaskModifyData } from "@server/interfaces/ITask";

interface GetPomosOptions {
  taskId?: number;
  historyOnly?: boolean;
  limit?: number;
}

const tasksRepository = (prisma: PrismaClient) => ({
  getAllTasks: (userId: string) =>
    prisma.tasks.findMany({
      where: { userId },
      include: { tags: true, category: true },
      orderBy: { sortOrder: "asc" },
    }),

  getOneTask: (userId: string, taskId: number) =>
    prisma.tasks.findFirst({
      where: { userId, id: taskId },
      include: { tags: true, category: true },
    }),

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

  getPomos: async (userId: string, options: GetPomosOptions = {}) => {
    const { taskId, historyOnly = false, limit } = options;

    const pomos = await prisma.pomo.findMany({
      where: {
        userId,
        ...(taskId !== undefined && { taskId }),
        ...(historyOnly && { endedAt: { not: null } }),
      },
      ...(historyOnly && { orderBy: { endedAt: "desc" } }),
      ...(limit !== undefined && { take: limit }),
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

  getActivePomo: (taskId: number, userId: string) =>
    prisma.pomo.findFirst({
      where: {
        taskId: taskId,
        userId: userId,
        endedAt: null,
      },
    }),

  createPomo: (taskId: number, userId: string, duration: number) => {
    return prisma.pomo.create({
      data: {
        userId: userId,
        taskId: taskId,
        duration: duration,
      },
    });
  },

  modifyPomoData: (pomoId: string, data: object) => {
    return prisma.pomo.update({
      where: {
        id: pomoId,
      },
      data: data,
    });
  },

  removePomosFromTask: (taskId: number) => {
    return prisma.pomo.deleteMany({
      where: { taskId: taskId },
    });
  },

  deletePomoRecord: (pomoId: string, userId: string) =>
    prisma.pomo.deleteMany({
      where: { id: pomoId, userId },
    }),

  reorderTasks: (
    userId: string,
    items: { taskId: number; sortOrder: number }[],
  ) =>
    prisma.$transaction(
      items.map(({ taskId, sortOrder }) =>
        prisma.tasks.update({
          where: { id: taskId, userId },
          data: { sortOrder },
        }),
      ),
    ),
});

export default tasksRepository;
