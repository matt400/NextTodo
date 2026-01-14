import fp from "fastify-plugin";
import { prisma } from "../lib/prisma.js";

import type { FastifyInstance, FastifyServerOptions } from "fastify";

async function prismaConnector(
  fastify: FastifyInstance,
  options: FastifyServerOptions,
) {
  await prisma.$connect();

  // Add prisma to fastify instance
  fastify.decorate("prisma", prisma);

  // Closes connection when server is shutting down
  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
}

export default fp(prismaConnector);
