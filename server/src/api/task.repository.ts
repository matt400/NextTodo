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

  modifyTaskData: async (taskId: number) => {},
});

export default tasksRepository;
