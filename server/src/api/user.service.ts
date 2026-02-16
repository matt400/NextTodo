import authRepository from "./auth.repository";

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
      password: isFull ? user.password : null,
    };
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
  const cp = await authRepository(prisma).updatePassword(userId, newPassword);
  if (!cp) throw Error("Prisma error");
  return cp;
}
