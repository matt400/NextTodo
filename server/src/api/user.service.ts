import authRepository from "./auth.repository";

import type { PrismaClient } from "@server/generated/prisma/client";

export async function getUserData(prisma: PrismaClient, userEmail: string) {
  const user = await authRepository(prisma).findByEmail(userEmail);
  if (!user) throw Error("No such user");

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    isActive: user.isActive,
  };
  return userData;
}
