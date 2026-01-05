import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import prismaPl from "./plugins/prisma.js";
import i18nPl from "./plugins/i18n.js";
import customDecoratorsPl from "./plugins/decorators.js";

import authAPI from "./api/auth.js";
import userAPI from "./api/user.js";

const fastify = Fastify({ logger: true });

// Decorators register
fastify.register(customDecoratorsPl);

fastify.register(i18nPl);

// CORS register, to allow requests from vite
await fastify.register(cors, {
    origin: "http://localhost:5173",
});

await fastify.register(prismaPl);

// JWT Register
fastify.register(jwt, { secret: "SUPER_SECRET_KEY123" });

// API
fastify.register(authAPI, { prefix: "/api/auth" });
fastify.register(userAPI, { prefix: "/api/user" });

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
