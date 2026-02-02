import { getUserData } from "./user.service";

import type { FastifyRequest, FastifyReply } from "fastify";
import type { IUser } from "@server/interfaces/IUser";

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
  request: FastifyRequest<IUser>,
  reply: FastifyReply,
) {
  const { current_password, password, new_password } = request.body;

  // Check current password
}
