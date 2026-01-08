import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import prismaPl from "./plugins/prisma.js";
import i18nPl from "./plugins/i18n.js";
import customDecoratorsPl from "./plugins/decorators.js";
import bcrypt from "./plugins/bcrypt.js";

import authAPI from "./api/auth/routes.js";
import userAPI from "./api/user.js";

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  fastify.setErrorHandler((error, request, reply) => {
    console.error("ERROR:", error); reply.status(500).send(error);
  });

  // Plugins
  await fastify.register(prismaPl);
  fastify.register(cookie);
  fastify.register(i18nPl);
  fastify.register(customDecoratorsPl);
  fastify.register(bcrypt);

  await fastify.register(cors, {
    origin: "http://localhost:5173",
  });

  fastify.register(jwt, { secret: "SUPER_SECRET_KEY123" });

  // API
  fastify.register(authAPI, { prefix: "/api/auth" });
  fastify.register(userAPI, { prefix: "/api/user" });

  return fastify;
}
