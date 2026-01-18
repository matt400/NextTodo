import repository from "./repository.js";

import type { FastifyInstance } from "fastify";
import type { User } from "@server/generated/prisma/client";

type Prisma = FastifyInstance["prisma"];
type Bcrypt = FastifyInstance["bcrypt"];

export async function loginUser(
  prisma: Prisma,
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
  prisma: Prisma,
  bcrypt: Bcrypt,
  userData: any,
) {
  const existingEmail = await repository(prisma).findByEmail(userData.email);
  if (existingEmail) return 2;

  const existingUsername = await repository(prisma).findByUsername(
    userData.username,
  );
  if (existingUsername) return 3;

  const password = await bcrypt.hash(userData.password);
  const createUser = await repository(prisma).create({
    username: userData.username,
    email: userData.email,
    password: password,
    isActive: true,
    lastLogin: new Date().toISOString(),
  });

  return createUser;
}
