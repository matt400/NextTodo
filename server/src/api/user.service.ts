import { AppError, handlePrismaError } from "@server/utils/errors";
import { validateEmail } from "@server/utils/email";

import authRepository from "./auth.repository";
import userRepository from "./user.repository";

import type { PrismaClient, User } from "@server/generated/prisma/client";
import type { UserUpdateData, UserSettings } from "@server/interfaces/IUser";

interface PublicUserData {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  settings: User["settings"];
}

interface FullUserData extends PublicUserData {
  password: string;
}

export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull: true,
): Promise<FullUserData>;
export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull?: false,
): Promise<PublicUserData>;
export async function getUserData(
  prisma: PrismaClient,
  userEmail: string,
  isFull: boolean = false,
): Promise<PublicUserData | FullUserData> {
  const valEmail = validateEmail(userEmail);
  if (!valEmail.isValid) throw new AppError(400, valEmail.errorKey as string);

  try {
    const user = await authRepository(prisma).findByEmail(userEmail);
    if (!user) throw new AppError(404, "USER_NOT_FOUND");

    const userData: PublicUserData = {
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
    throw err;
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
  data: UserUpdateData,
) {
  try {
    return await userRepository(prisma).updateData(userId, data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    handlePrismaError(err);
  }
}

export async function updateSettings(
  prisma: PrismaClient,
  userId: string,
  settings: UserSettings,
) {
  try {
    return await userRepository(prisma).updateSettings(userId, settings);
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
