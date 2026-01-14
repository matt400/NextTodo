import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook("preValidation", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.redirect("/login");
    }
  });

  fastify.get("/me", async (request, reply) => {
    return { user: request.user, message: `Hi! ${request.user.email}` };
  });
}
