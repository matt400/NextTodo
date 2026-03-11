import path from "path";
import Fastify from "fastify";
import i18next from "i18next";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fStatic from "@fastify/static";
import jwt from "@fastify/jwt";

import prismaPl from "@server/plugins/prisma";
import i18nPl from "@server/plugins/i18n";
import i18nPlR from "@server/plugins/i18n.reply";
import bcrypt from "@server/plugins/bcrypt";
import auth from "@server/plugins/auth";

import authRoutes from "@server/api/auth.routes";
import userRoutes from "@server/api/user.routes";
import taskRoutes from "@server/api/task.routes";

import { AppError } from "@server/utils/errors";

import type { FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: true });

  fastify.setErrorHandler((error, request, reply) => {
    const t = request.t || i18next.t.bind(i18next);

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        success: false,
        error: {
          code: error.statusCode, // np. "USER_ALREADY_EXISTS"
          message: t(error.message), // przetłumaczone
        },
      });
    }

    return reply.code(500).send({
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: t("UNKNOWN_ERROR"),
      },
    });
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
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  });

  fastify.register(fStatic, {
    root: path.join(__dirname, "../../..", "public"),
    prefix: "/",
  });

  fastify.get("/api_docs", function (_, reply) {
    return reply.sendFile("api_docs.html");
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
  fastify.register(taskRoutes, { prefix: "/api/task" });

  return fastify;
}
