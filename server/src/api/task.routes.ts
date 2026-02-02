import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
  fastify.post(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
  fastify.delete(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
  fastify.patch(
    "/",
    {
      preHandler: [fastify.userAccessOnly],
    },
    async (request, reply) => {},
  );
}
