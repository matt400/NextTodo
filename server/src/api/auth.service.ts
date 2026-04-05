import repository from "./auth.repository";

import {
  validatePasswordsMatch,
  validatePasswordStrength,
} from "@server/utils/password";

import { validateEmail } from "@server/utils/email";

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

  // Validate email format
  const valEmail = validateEmail(userData.email);
  if (!valEmail.isValid) data.errors.push(valEmail.errorKey as string);

  // Validate password strength
  const passwordStrength = validatePasswordStrength(userData.password);
  if (!passwordStrength.isValid)
    data.errors.push(passwordStrength.errorKey as string);

  // Validate passwords match
  const passwordMatch = validatePasswordsMatch(
    userData.password,
    userData.confirm_password,
  );
  if (!passwordMatch.isValid)
    data.errors.push(passwordMatch.errorKey as string);

  // Early return before DB calls if basic validation fails
  if (data.errors.length > 0) return data;

  // Check if email already exists
  const existingEmail = await repository(prisma).findByEmail(userData.email);
  if (existingEmail) data.errors.push("WRONG_EMAIL");

  // Check if username already exists
  const existingUsername = await repository(prisma).findByUsername(
    userData.username,
  );
  if (existingUsername) data.errors.push("WRONG_USERNAME");

  if (data.errors.length > 0) return data;

  // Create user
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
