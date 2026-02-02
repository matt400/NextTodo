import { getDataController, changePasswordController } from "./user.controller";
import { changePasswordSchema } from "./user.schema";

import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    { preHandler: [fastify.userAccessOnly] },
    getDataController,
  );

  // Future: Update user data
  fastify.patch(
    "/me",
    { preHandler: [fastify.userAccessOnly] },
    async (request, reply) => {},
  );

  fastify.post(
    "/me/change-password",
    {
      preHandler: [fastify.userAccessOnly],
      schema: changePasswordSchema,
      bodyLimit: 100,
    },
    changePasswordController,
  );

  fastify.post(
    "/logout",
    { preHandler: [fastify.userAccessOnly] },
    async (req, reply) => {
      return reply.clearCookie("access_token").ok("LOGGED_OUT");
    },
  );
}
