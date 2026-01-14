import { loginUser, registerUser } from "./service.js";
import { createToken } from "../../utils/api.js";

import type { FastifyRequest, FastifyReply } from "fastify";

interface LoginRequest {
  email: string;
  password: string;
}

export async function loginController(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  // Check if user exists
  const user = await loginUser(
    request.server.prisma,
    request.server.bcrypt,
    email,
    password,
  );
  if (!user) {
    return reply.fail("AUTH_FAILED", reply.statusCode);
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

interface RegisterRequest {
  Body: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  Cookies: {
    access_token?: string;
  };
}

export async function registerController(
  request: FastifyRequest<RegisterRequest>,
  reply: FastifyReply,
) {
  const token = request.cookies.access_token;
  if (token) return reply.fail("ALREADY_REGISTERED");

  const { username, email, password, confirm_password } = request.body;

  const regUser = await registerUser(
    request.server.prisma,
    request.server.bcrypt,
    {
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password,
    },
  );

  if (regUser == 2) return reply.fail("WRONG_EMAIL", 422);
  else if (regUser == 3) return reply.fail("WRONG_USERNAME", 422);
  else return reply.ok("REGISTER_SUCCESS");
}
