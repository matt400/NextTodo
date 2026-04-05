import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply, FastifyPluginAsync } from "fastify";

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    "userAccessOnly",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.cookies.access_token) {
        try {
          await request.jwtVerify();
          return;
        } catch (err) {
          return reply.fail("NO_ACCESS", 403);
        }
      }
      return reply.fail("NO_ACCESS", 403);
    },
  );

  fastify.decorate(
    "guestAccessOnly",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.cookies.access_token) return reply.fail("NO_ACCESS", 403);
    },
  );
};

export default fp(authPlugin);
