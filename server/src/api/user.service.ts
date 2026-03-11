import authRepository from "./auth.repository";
import userRepository from "./user.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull: boolean = false,
) {
  try {
    const user = await authRepository(prisma).findByEmail(userEmail);
    if (!user) throw Error("No such user");

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };

    if (isFull) return { ...userData, password: user.password };
    return userData;
  } catch (err: any) {
    throw Error(err);
  }
}

export async function changePassword(
  prisma: PrismaClient,
  userId: string,
  newPassword: string,
) {
  return await authRepository(prisma).updatePassword(userId, newPassword);
}

export async function updateData(
  prisma: PrismaClient,
  userId: string,
  data: object,
) {
  return await userRepository(prisma).updateData(userId, data);
}
