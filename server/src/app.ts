import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import prismaPl from "@server/plugins/prisma";
import i18nPl from "@server/plugins/i18n";
import i18nPlR from "@server/plugins/i18n.reply";
import bcrypt from "@server/plugins/bcrypt";
import auth from "@server/plugins/auth";

import authRoutes from "@server/api/auth.routes";
import userRoutes from "@server/api/user.routes";

import type { FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
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
  fastify.register(auth);

  await fastify.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
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
