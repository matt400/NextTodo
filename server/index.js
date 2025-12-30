import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

// CORS register, to allow requests from vite 
await fastify.register(cors, { 
    origin: "http://localhost:5173" 
});

fastify.get('/api/todo', async (request, reply) => {
    return {
        tasks: ['Nauczyć się Vite', 'Opanować Fastify']
    };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
