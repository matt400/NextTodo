import repository from "./auth.repository";

import type { User, PrismaClient } from "@server/generated/prisma/client";
import type { RegisterRequestBody } from "@server/interfaces/IAuth";
import type { Bcrypt } from "@server/typescript/fastify";

export async function loginUser(
  prisma: PrismaClient,
  bcrypt: Bcrypt,
  email: string,
  password: string,
): Promise<Boolean | User> {
  const user = await repository(prisma).findByEmail(email);
  if (!user) return false;

  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) return false;

  return user;
}

export async function registerUser(
  prisma: PrismaClient,
  bcrypt: Bcrypt,
  userData: RegisterRequestBody,
) {
  const data = { errors: [] as number[], userData: {} };
  const existingEmail = await repository(prisma).findByEmail(userData.email);
  if (existingEmail) data.errors.push(1);

  const existingUsername = await repository(prisma).findByUsername(
    userData.username,
  );
  if (existingUsername) data.errors.push(2);
  if (userData.password != userData.confirm_password) data.errors.push(3);

  if ((data.errors as number[]).length > 0) return data;

  const password = await bcrypt.hash(userData.password, 10);

  const createUser = await repository(prisma).create({
    username: userData.username,
    email: userData.email,
    password: password,
    isActive: true,
    lastLogin: new Date().toISOString(),
  });

  data.userData = createUser;
  return data;
}
