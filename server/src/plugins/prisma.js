import fp from "fastify-plugin";
import { prisma } from "../lib/prisma.js";

async function prismaConnector(fastify, options) {
  await prisma.$connect();

  // Add prisma to fastify instance
  fastify.decorate("prisma", prisma);

  // Closes connection when server is shutting down
  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
}

export default fp(prismaConnector);
