import { PrismaClient } from "@prismagl";

const tagRepository = (prisma: PrismaClient) => ({
  getAllTags: (userId: string) =>
    prisma.tag.findMany({
      where: { userId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: "asc" },
    }),

  getOneTag: (tagId: number, userId: string) =>
    prisma.tag.findUnique({
      where: { id: tagId, userId },
      include: { _count: { select: { tasks: true } } },
    }),

  tagExists: (tagId: number, userId: string) =>
    prisma.tag.findUnique({
      where: { id: tagId, userId },
      select: { id: true },
    }),

  createTag: (userId: string, name: string, color: string) =>
    prisma.tag.create({
      data: { userId, name, color },
    }),

  modifyTag: (
    tagId: number,
    userId: string,
    data: Partial<{ name: string; color: string }>,
  ) =>
    prisma.tag.update({
      where: { id: tagId, userId },
      data,
    }),

  removeTag: (tagId: number, userId: string) =>
    prisma.tag.delete({
      where: { id: tagId, userId },
    }),

  // Used to enforce the max-10-tags-per-task limit
  getTagsOnTask: (taskId: number) =>
    prisma.tasks.findUnique({
      where: { id: taskId },
      select: { tags: { select: { id: true } } },
    }),

  addTagToTask: (taskId: number, tagId: number) =>
    prisma.tasks.update({
      where: { id: taskId },
      data: { tags: { connect: { id: tagId } } },
    }),

  removeTagFromTask: (taskId: number, tagId: number) =>
    prisma.tasks.update({
      where: { id: taskId },
      data: { tags: { disconnect: { id: tagId } } },
    }),

  // Returns tasks that have at least one of the requested tags (OR logic)
  getTasksByTagIds: (userId: string, tagIds: number[]) =>
    prisma.tasks.findMany({
      where: {
        userId,
        tags: { some: { id: { in: tagIds } } },
      },
      include: {
        tags: true,
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
});

export default tagRepository;
