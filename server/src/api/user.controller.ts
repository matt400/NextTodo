import {
  getUserData,
  changePassword,
  updateData,
  updateSettings,
  removeUser,
} from "./user.service";

import {
  validatePasswordStrength,
  validatePasswordsMatch,
  validatePasswordsDifferent,
} from "@server/utils/password";

import type { FastifyRequest, FastifyReply } from "fastify";
import type {
  IChangePassword,
  IRemoveUser,
  IUpdateData,
  IUserSettings,
  UserSettings,
} from "@server/interfaces/IUser";

export async function getDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userData = await getUserData(request.server.prisma, request.user.email);
  return reply.code(200).send(userData);
}

export async function changePasswordController(
  request: FastifyRequest<IChangePassword>,
  reply: FastifyReply,
) {
  const { current_password, new_password, confirm_password } = request.body;

  const matchValidation = validatePasswordsMatch(
    new_password,
    confirm_password,
  );
  if (!matchValidation.isValid)
    return reply.fail(matchValidation.errorKey!, 400);

  const strengthValidation = validatePasswordStrength(new_password);
  if (!strengthValidation.isValid)
    return reply.fail(strengthValidation.errorKey!, 400);

  const differentValidation = validatePasswordsDifferent(
    current_password,
    new_password,
  );
  if (!differentValidation.isValid)
    return reply.fail(differentValidation.errorKey!, 400);

  const userData = await getUserData(
    request.server.prisma,
    request.user.email,
    true,
  );

  const isPasswordValid = await request.server.bcrypt.compare(
    current_password,
    userData.password,
  );
  if (!isPasswordValid) return reply.fail("INVALID_CURRENT_PASSWORD", 401);

  const hashedPassword = await request.server.bcrypt.hash(new_password, 10);
  await changePassword(request.server.prisma, userData.id, hashedPassword);

  return reply.ok("PASSWORD_CHANGED_SUCCESSFULLY");
}

export async function updateUserDataController(
  request: FastifyRequest<IUpdateData>,
  reply: FastifyReply,
) {
  const { username, email, isActive } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);

  const errors: string[] = [];
  if (username !== undefined && username === userData.username)
    errors.push("USERNAME");
  if (email !== undefined && email === userData.email) errors.push("EMAIL");
  if (isActive !== undefined && isActive === userData.isActive)
    errors.push("ISACTIVE");

  if (errors.length > 0)
    return reply.fail("UPDATE_VALIDATION_ERROR", 400, errors);

  await updateData(request.server.prisma, userData.id, {
    username,
    email,
    isActive,
  });

  return reply.ok("UPDATE_USER_DATA_SUCCESS");
}

export async function removeUserController(
  request: FastifyRequest<IRemoveUser>,
  reply: FastifyReply,
) {
  const { email } = request.body;
  if (email !== request.user.email)
    return reply.fail("EMAIL_NOT_MATCHING", 400);

  const user = await getUserData(request.server.prisma, request.user.email);
  await removeUser(request.server.prisma, user.id);

  return reply.ok("USER_REMOVED");
}

export async function userSettingsController(
  request: FastifyRequest<IUserSettings>,
  reply: FastifyReply,
) {
  const { userSettings } = request.body;

  const userData = await getUserData(request.server.prisma, request.user.email);
  const prevSettings = (userData.settings ?? {}) as UserSettings;
  const skipped: string[] = [];
  const changes: Record<string, unknown> = {};

  for (const key of Object.keys(userSettings) as (keyof UserSettings)[]) {
    if (!(key in prevSettings)) {
      skipped.push(`${key} (unknown field)`);
      continue;
    }

    if (prevSettings[key] === userSettings[key]) {
      skipped.push(`${key} (cannot be the same)`);
      continue;
    }

    changes[key] = userSettings[key];
  }

  if (Object.keys(changes).length === 0)
    return reply.fail("USER_DATA_UPDATE_FAILED", 400, skipped);

  await updateSettings(request.server.prisma, userData.id, {
    ...prevSettings,
    ...changes,
  });

  return reply.ok("USER_DATA_UPDATED", skipped);
}

export async function logoutController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.clearCookie("access_token").ok("LOGGED_OUT");
}
