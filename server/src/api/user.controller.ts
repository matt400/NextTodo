import { getUserData, changePassword, updateData } from "./user.service";
import {
  validatePasswordStrength,
  validatePasswordsMatch,
  validatePasswordsDifferent,
} from "@server/utils/password";

import type { FastifyRequest, FastifyReply } from "fastify";
import type { IChangePassword, IUpdateData } from "@server/interfaces/IUser";

export async function getDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userEmail = request.user.email;
  try {
    const userData = await getUserData(request.server.prisma, userEmail);
    return reply.send(userData);
  } catch {
    return reply.fail("NO_SUCH_USER", 404);
  }
}

export async function changePasswordController(
  request: FastifyRequest<IChangePassword>,
  reply: FastifyReply,
) {
  const { current_password, new_password, confirm_password } = request.body;
  const userEmail = request.user.email;

  const matchValidation = validatePasswordsMatch(
    new_password,
    confirm_password,
  );
  if (!matchValidation.isValid) {
    return reply.fail(matchValidation.errorKey!, 400);
  }

  const strengthValidation = validatePasswordStrength(new_password);
  if (!strengthValidation.isValid) {
    return reply.fail(strengthValidation.errorKey!, 400);
  }

  const differentValidation = validatePasswordsDifferent(
    current_password,
    new_password,
  );

  if (!differentValidation.isValid) {
    return reply.fail(differentValidation.errorKey!, 400);
  }

  if (new_password !== confirm_password) {
    return reply.fail("PASSWORDS_DO_NOT_MATCH", 400);
  }

  try {
    const userData = await getUserData(request.server.prisma, userEmail, true);

    if (!("password" in userData)) {
      throw new Error("User has no password object!");
    }

    const isPasswordValid: boolean = await request.server.bcrypt.compare(
      current_password,
      userData.password ?? "",
    );

    if (!isPasswordValid) {
      return reply.fail("INVALID_CURRENT_PASSWORD", 401);
    }

    const hashedPassword: string = await request.server.bcrypt.hash(
      new_password,
      10,
    );

    const cp = await changePassword(
      request.server.prisma,
      userData.id,
      hashedPassword,
    );

    // Todo: Future: log
    console.log(cp);
    return reply.ok("PASSWORD_CHANGED_SUCCESSFULLY");
  } catch {
    return reply.fail("NO_SUCH_USER", 404);
  }
}

export async function updateUserDataController(
  request: FastifyRequest<IUpdateData>,
  reply: FastifyReply,
) {
  const { username, email, isActive } = request.body;
  const userEmail = request.user.email;

  try {
    const userData = await getUserData(request.server.prisma, userEmail);

    const errors = [];
    if (username == userData.username) errors.push("USERNAME");
    if (email == userData.email) errors.push("EMAIL");
    if (isActive == userData.isActive) errors.push("ISACTIVE");

    if (errors.length > 0)
      return reply.fail("UPDATE_VALIDATION_ERROR", 400, errors);

    await updateData(request.server.prisma, userData.id, {
      username: username,
      email: email,
      isActive: isActive,
    });
    return reply.ok("UPDATE_USER_DATA_SUCCESS");
  } catch (err) {
    return reply.code(500).send(err);
  }
}
