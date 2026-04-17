import { buildApp } from "./app";

const start = async () => {
  try {
    const fastify = await buildApp();
    await fastify.listen({ port: 3000 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
