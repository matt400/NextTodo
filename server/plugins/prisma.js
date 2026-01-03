import fp from 'fastify-plugin';
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

async function prismaConnector(fastify, options) {
    const connectionString = `${process.env.DATABASE_URL}`;

    const adapter = new PrismaBetterSqlite3({ url: connectionString });
    const prisma = new PrismaClient({ adapter });

    await prisma.$connect();

    // Add prisma to fastify instance
    fastify.decorate('prisma', prisma);

    // Closes connection when server is shutting down
    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
}

export default fp(prismaConnector);
