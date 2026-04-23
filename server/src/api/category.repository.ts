import { PrismaClient } from "@prismagl";

const categoryRepository = (prisma: PrismaClient) => ({
  getAllCategories: (userId: string) =>
    prisma.category.findMany({
      where: { userId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: "asc" },
    }),

  getOneCategory: (categoryId: number, userId: string) =>
    prisma.category.findUnique({
      where: { id: categoryId, userId },
      include: { _count: { select: { tasks: true } } },
    }),

  createCategory: (
    userId: string,
    name: string,
    color: string,
    icon: string,
  ) =>
    prisma.category.create({
      data: { userId, name, color, icon },
    }),

  modifyCategory: (
    categoryId: number,
    userId: string,
    data: Partial<{ name: string; color: string; icon: string }>,
  ) =>
    prisma.category.update({
      where: { id: categoryId, userId },
      data,
    }),

  removeCategory: (categoryId: number, userId: string) =>
    prisma.category.delete({
      where: { id: categoryId, userId },
    }),

  categoryExists: (categoryId: number, userId: string) =>
    prisma.category.findUnique({
      where: { id: categoryId, userId },
      select: { id: true },
    }),

  getTasksByCategory: (categoryId: number, userId: string) =>
    prisma.tasks.findMany({
      where: { categoryId, userId },
      orderBy: { sortOrder: "asc" },
    }),
});

export default categoryRepository;
