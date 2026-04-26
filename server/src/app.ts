import path from "path";
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
import categoryRoutes from "@server/api/category.routes";

import type { FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: true });
  const isProduction = process.env.NODE_ENV === "production";

  // Errors
  fastify.setErrorHandler(errorHandler);

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

  if (isProduction) {
    // Load embedded client files
    const clientFiles: Record<string, string> = require("client-bundle");

    const mime: Record<string, string> = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".ico": "image/x-icon",
      ".json": "application/json",
      ".woff2": "font/woff2",
      ".woff": "font/woff",
      ".ttf": "font/ttf",
    };

    fastify.get("/*", (request, reply) => {
      const url = (request.params as { "*": string })["*"];
      const filePath = "/" + (url || "index.html");
      const fileContent =
        clientFiles[filePath] ?? clientFiles["/index.html"] ?? "";
      const ext = path.extname(filePath) || ".html";

      reply
        .header("Content-Type", mime[ext] ?? "application/octet-stream")
        .send(Buffer.from(fileContent, "base64"));
    });

    console.log("Running in production mode.");
  } else {
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
  fastify.register(categoryRoutes, { prefix: "/api/category" });

  return fastify;
}
