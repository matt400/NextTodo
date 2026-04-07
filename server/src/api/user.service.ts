import { AppError, handlePrismaError } from "@server/utils/errors";
import { validateEmail } from "@server/utils/email";

import authRepository from "./auth.repository";
import userRepository from "./user.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull: true,
): Promise<any>;
export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull?: false,
): Promise<any>;
export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull: boolean = false,
) {
  const valEmail = validateEmail(userEmail);
  if (!valEmail.isValid) throw new AppError(400, valEmail.errorKey as string);

  try {
    const user = await authRepository(prisma).findByEmail(userEmail);
    if (!user) throw new AppError(404, "USER_NOT_FOUND");

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      settings: user.settings,
    };

    if (isFull) return { ...userData, password: user.password };
    return userData;
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function changePassword(
  prisma: PrismaClient,
  userId: string,
  newPassword: string,
) {
  try {
    return await authRepository(prisma).updatePassword(userId, newPassword);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function updateData(
  prisma: PrismaClient,
  userId: string,
  data: object,
) {
  try {
    return await userRepository(prisma).updateData(userId, data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function removeUser(prisma: PrismaClient, userId: string) {
  try {
    return await userRepository(prisma).removeUser(userId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}
