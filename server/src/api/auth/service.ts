import repository from "./repository.js";

import type { FastifyInstance } from "fastify";
type Prisma = FastifyInstance["prisma"];
type Bcrypt = FastifyInstance["bcrypt"];

export async function loginUser(
  prisma: Prisma,
  bcrypt: Bcrypt,
  email: string,
  password: string,
) {
  const user = await repository(prisma).findByEmail(email);
  if (!user) return null;

  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) return null;

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

  const password = await bcrypt.hash(userData.password, 10);
  const createUser = await repository(prisma).create({
    username: userData.username,
    email: userData.email,
    password: password,
    isActive: true,
    lastLogin: new Date().toISOString(),
  });

  return createUser;
}
