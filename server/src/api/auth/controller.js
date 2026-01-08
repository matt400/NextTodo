import { loginUser } from "./service.js";
import { createToken } from "./utils.js";

export async function loginController(request, reply) {
  const { email, password } = request.body;

  // Check if user exists
  const user = await loginUser(reply.server.prisma,
    reply.server.bcrypt, email, password);
  if (!user) {
    return reply.fail("INVALID_CREDENTIALS");
  }

  const token = createToken(reply.server.jwt, { email });

  return reply
    .setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600,
    }).ok("LOGIN_SUCCESS");
}

export async function registerController(request, reply) {
  const { username, email, password } = request.body;

  // validation
  // check db
  // register user
  // return reply
}
