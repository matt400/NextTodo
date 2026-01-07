import { loginController, registerController } from "./controller.js";
import { loginSchema, registerSchema } from "./schema.js";

export default async function authRoutes(fastify) {
  fastify.post("/login", { schema: loginSchema }, loginController);

  fastify.post("/logout", async (req, reply) => {
    reply.clearCookie("access_token").send({ message: "Wylogowano" });
  });

  fastify.post("/register", { schema: registerSchema }, registerController);
}
