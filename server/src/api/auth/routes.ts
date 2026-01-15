import { onlyGuest } from "../../utils/api.js";
import { loginController, registerController } from "./controller.js";
import { loginSchema, registerSchema } from "./schema.js";

import type { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.register(async (guestGroup) => {
    guestGroup.addHook("preValidation", onlyGuest);

    guestGroup.post(
      "/login",
      { schema: loginSchema, bodyLimit: 200 },
      loginController,
    );

    guestGroup.post(
      "/register",
      { schema: registerSchema, bodyLimit: 200 },
      registerController,
    );
  });

  fastify.post("/logout", async (req, reply) => {
    reply.clearCookie("access_token").ok("LOGGED_OUT");
  });
}
