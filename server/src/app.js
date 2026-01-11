import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import prismaPl from "./plugins/prisma.js";
import i18nPl from "./plugins/i18n.js";
import i18nPlR from "./plugins/i18n.reply.js";
import bcrypt from "./plugins/bcrypt.js";

import authRoutes from "./api/auth/routes.js";
import userRoutes from "./api/user/routes.js";

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  fastify.setErrorHandler((error, request, reply) => {
    console.error("ERROR:", error);
    reply.status(500).send(error);
  });

  // Plugins
  await fastify.register(prismaPl);
  fastify.register(cookie);
  fastify.register(i18nPl);
  fastify.register(i18nPlR);
  fastify.register(bcrypt);

  await fastify.register(cors, {
    origin: "http://localhost:5173",
  });

  fastify.register(jwt, {
    secret: "SUPER_SECRET_KEY123",
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });

  // API
  fastify.register(authRoutes, { prefix: "/api/auth" });
  fastify.register(userRoutes, { prefix: "/api/user" });

  return fastify;
}
