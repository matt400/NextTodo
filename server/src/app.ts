import path from "path";
import fs from "fs";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fStatic from "@fastify/static";
import jwt from "@fastify/jwt";

import { errorHandler } from "@server/plugins/errorHandler";
import prismaPl from "@server/plugins/prisma";
import i18nPl from "@server/plugins/i18n";
import i18nPlR from "@server/plugins/i18n.reply";
import bcrypt from "@server/plugins/bcrypt";
import auth from "@server/plugins/auth";

import authRoutes from "@server/api/auth.routes";
import userRoutes from "@server/api/user.routes";
import taskRoutes from "@server/api/task.routes";

import type { FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: true });
  const isProduction = !!(process as any).pkg;

  // Errors
  fastify.setErrorHandler(errorHandler);

  // Plugins
  await fastify.register(prismaPl);
  fastify.register(cookie);
  fastify.register(i18nPl);
  fastify.register(i18nPlR);
  fastify.register(bcrypt);
  fastify.register(auth);

  if (isProduction) {
    const distPath = path.join(__dirname, "../../client/dist");

    fastify.register(fStatic, {
      root: distPath,
      prefix: "/",
    });

    fastify.setNotFoundHandler((request, reply) => {
      const indexHtml = fs.readFileSync(path.join(distPath, "index.html"));
      reply.type("text/html").send(indexHtml);
    });

    console.log("Running in production mode.");
  } else {
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

    console.log("Running in DEV mode.");
  }

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
