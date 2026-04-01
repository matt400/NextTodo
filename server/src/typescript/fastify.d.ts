import "fastify";
import "@fastify/jwt";
import { PrismaClient } from "@prisma/client";

import type * as bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";

export type AuthenticateFunction = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    bcrypt: typeof bcrypt;
    userAccessOnly: AuthenticateFunction;
    guestAccessOnly: AuthenticateFunction;
  }

  interface FastifyRequest {
    t: (key: string) => string;
  }

  interface FastifyReply {
    fail(messageKey: string, statusCode?: number, data?: object);
    ok(messageKey: string, data?: object);
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string };
    user: { id: number; email: string };
  }
}

export type Bcrypt = typeof bcrypt;
