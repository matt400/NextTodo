/* This makes imports below available in all tests */

import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

global.Fastify = Fastify;
global.fastifyJwt = fastifyJwt;
global.cookie = cookie;
