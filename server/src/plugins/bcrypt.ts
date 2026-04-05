import fp from "fastify-plugin";
import * as bcrypt from "bcrypt";

import type { FastifyInstance } from "fastify";

async function bCryptPlugin(fastify: FastifyInstance) {
  fastify.decorate("bcrypt", bcrypt);
}

export default fp(bCryptPlugin);
