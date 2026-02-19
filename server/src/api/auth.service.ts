import repository from "./auth.repository";

import {
  validatePasswordsMatch,
  validatePasswordStrength,
} from "@server/utils/password";

import type { Bcrypt } from "@server/typescript/fastify";
import type { User, PrismaClient } from "@server/generated/prisma/client";
import type { RegisterRequestBody } from "@server/interfaces/IAuth";

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
  const data = { errors: [] as string[], userData: {} };

  // Check if email exists
  const existingEmail = await repository(prisma).findByEmail(userData.email);
  if (existingEmail) data.errors.push("WRONG_EMAIL");

  // Check if username exists
  const existingUsername = await repository(prisma).findByUsername(
    userData.username,
  );
  if (existingUsername) data.errors.push("WRONG_USERNAME");

  // Check if password has proper strength
  const passwordStrength = validatePasswordStrength(userData.password);
  if (!passwordStrength.isValid)
    data.errors.push(passwordStrength.errorKey as string);

  // Check if passwords match
  const passwordMatch = validatePasswordsMatch(
    userData.password,
    userData.confirm_password,
  );
  if (!passwordMatch.isValid)
    data.errors.push(passwordMatch.errorKey as string);

  if (data.errors.length > 0) return data;

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
