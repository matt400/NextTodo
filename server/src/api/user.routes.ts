import {
  getDataController,
  changePasswordController,
  updateUserDataController,
  removeUserController,
  userSettingsController,
  logoutController,
} from "./user.controller";

import {
  changePasswordSchema,
  updateDataSchema,
  removeUserSchema,
  userSettingsSchema,
} from "./user.schema";

import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    { preHandler: [fastify.userAccessOnly] },
    getDataController,
  );

  fastify.patch(
    "/me",
    {
      schema: updateDataSchema,
      preHandler: [fastify.userAccessOnly],
    },
    updateUserDataController,
  );

  fastify.delete(
    "/me",
    {
      schema: removeUserSchema,
      preHandler: [fastify.userAccessOnly],
    },
    removeUserController,
  );

  fastify.post(
    "/me/change-password",
    {
      preHandler: [fastify.userAccessOnly],
      schema: changePasswordSchema,
      bodyLimit: 200,
    },
    changePasswordController,
  );

  fastify.patch(
    "/me/settings",
    {
      preHandler: [fastify.userAccessOnly],
      schema: userSettingsSchema,
    },
    userSettingsController,
  );

  fastify.post(
    "/logout",
    { preHandler: [fastify.userAccessOnly] },
    logoutController,
  );
}
