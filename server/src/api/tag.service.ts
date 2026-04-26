import { PrismaClient } from "@server/generated/prisma/client";

export async function createTag(
  prisma: PrismaClient,
  userId: string,
  name: string,
) {
  return await prisma.tag.create({
    data: { name, userId },
  });
}

export async function addTagToTask(
  prisma: PrismaClient,
  taskId: number,
  tagId: number,
) {
  return await prisma.tasks.update({
    where: { id: taskId },
    data: {
      tags: { connect: { id: tagId } },
    },
  });
}
