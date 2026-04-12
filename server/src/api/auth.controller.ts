import { loginUser, registerUser } from "./auth.service";
import { createToken } from "@server/utils/api";

import type { FastifyRequest, FastifyReply } from "fastify";
import type { ILoginRequest, IRegisterRequest } from "@server/interfaces/IAuth";

export async function loginController(
  request: FastifyRequest<ILoginRequest>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await loginUser(
    request.server.prisma,
    request.server.bcrypt,
    email,
    password,
  );
  if (!user) {
    return reply.fail("AUTH_FAILED", 400);
  }

  const token = createToken(reply.server.jwt, { email });

  return reply
    .setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600,
    })
    .ok("LOGIN_SUCCESS");
}

export async function registerController(
  request: FastifyRequest<IRegisterRequest>,
  reply: FastifyReply,
) {
  const { username, email, password, confirm_password } = request.body;

  const result = await registerUser(
    request.server.prisma,
    request.server.bcrypt,
    { username, email, password, confirm_password },
  );
  const errors = result.errors;

  if (errors.length > 0) {
    return reply.fail(errors[0] as string, 422);
  }

  return reply.ok("REGISTER_SUCCESS");
}
