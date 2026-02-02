import { loginController, registerController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";

import type { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      preHandler: [fastify.guestAccessOnly],
      schema: loginSchema,
      bodyLimit: 200,
    },
    loginController,
  );

  fastify.post(
    "/register",
    {
      preHandler: [fastify.guestAccessOnly],
      schema: registerSchema,
      bodyLimit: 200,
    },
    registerController,
  );
}
