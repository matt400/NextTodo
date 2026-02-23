import type { PrismaClient } from "@prismagl";

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

  modifyTaskData: async (taskId: number, userId: string, data: object) => {
    const task = await prisma.tasks.findUnique({
      where: { id: taskId, userId: userId },
    });
    if (!task) throw new Error("Task not found");

    if (Object.keys(data).length > 1)
      await prisma.tasks.updateMany({
        where: { id: taskId, userId: userId },
        data: data,
      });
    else
      await prisma.tasks.update({
        where: { id: taskId, userId: userId },
        data: data,
      });
  },
});

export default tasksRepository;
