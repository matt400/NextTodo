import { AppError, handlePrismaError } from "@server/utils/errors";
import repository from "./category.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

export async function getAllCategories(prisma: PrismaClient, userId: string) {
  try {
    return await repository(prisma).getAllCategories(userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getOneCategory(
  prisma: PrismaClient,
  userId: string,
  categoryId: number,
) {
  try {
    const category = await repository(prisma).getOneCategory(categoryId, userId);
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function createCategory(
  prisma: PrismaClient,
  userId: string,
  name: string,
  color: string,
  icon: string,
) {
  try {
    return await repository(prisma).createCategory(userId, name, color, icon);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function modifyCategory(
  prisma: PrismaClient,
  userId: string,
  categoryId: number,
  data: Partial<{ name: string; color: string; icon: string }>,
) {
  try {
    const exists = await repository(prisma).categoryExists(categoryId, userId);
    if (!exists) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return await repository(prisma).modifyCategory(categoryId, userId, data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function removeCategory(
  prisma: PrismaClient,
  userId: string,
  categoryId: number,
) {
  try {
    const exists = await repository(prisma).categoryExists(categoryId, userId);
    if (!exists) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return await repository(prisma).removeCategory(categoryId, userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function getTasksByCategory(
  prisma: PrismaClient,
  userId: string,
  categoryId: number,
) {
  try {
    const exists = await repository(prisma).categoryExists(categoryId, userId);
    if (!exists) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return await repository(prisma).getTasksByCategory(categoryId, userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}
