import { loginUser, registerUser } from "./service.js";
import { createToken } from "../../utils/api.js";

export async function loginController(request, reply) {
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

export async function registerController(request, reply) {
  const token = request.cookies.access_token === true;
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
