export default async function userRoutes(fastify, options) {
    // SECURE 
    fastify.get('/me', async (request, reply) => {
        const token = request.cookies.access_token;

        if (!token) return reply.fail(statusCode = 401, message = 'NO_TOKEN');
        try {
            const decoded = fastify.jwt.verify(token);
            return { user: decoded.email };
        } catch (err) {
            return reply.fail(statusCode = 401, message = 'INVALID_TOKEN');
        }
    });
}
