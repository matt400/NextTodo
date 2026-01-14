import fp from "fastify-plugin";
import bcrypt from "bcrypt";

import type { FastifyInstance } from "fastify";
import type BcryptDecorator from "../types/interfaces/bcryptDecorator.js";

async function bCryptPlugin(fastify: FastifyInstance) {
  const bcryptObject: BcryptDecorator = {
    hash: (password: string) => bcrypt.hash(password, 10),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
  };

  fastify.decorate("bcrypt", bcryptObject);
}

export default fp(bCryptPlugin);
