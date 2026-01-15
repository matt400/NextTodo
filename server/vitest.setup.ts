/* This makes imports below available in all tests */

declare global {
  var Fastify: typeof import("fastify").default;
  var fastifyJwt: typeof import("@fastify/jwt").default;
  var cookie: typeof import("@fastify/cookie").default;
}

export {};
