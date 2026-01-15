import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import type BcryptDecorator from "../interfaces/bcryptDecorator.ts";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    bcrypt: BcryptDecorator;
  }

  interface FastifyRequest {
    t: (key: string) => string;
  }

  interface FastifyReply {
    fail(messageKey: string, statusCode?: number);
    ok(messageKey: string);
  }
}

export {};
