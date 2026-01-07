import fp from "fastify-plugin";
import bcrypt from "bcrypt";

async function bCrypt(fastify) {
  fastify.decorate("bcrypt", {
    hash: (password) => bcrypt.hash(password, 10),
    compare: (password, hash) => bcrypt.compare(password, hash),
  });
}

export default fp(bCrypt)
