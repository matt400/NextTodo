export default async function authRoutes(fastify, options) {
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;

        // (Tu weryfikacja użytkownika w bazie)
        const token = fastify.jwt.sign({ email });

        // 2. Wysyłanie tokena w ciasteczku
        return reply.setCookie('access_token', token, {
            path: '/',
            httpOnly: true, // JS has no access
            secure: false, // true on production 
            sameSite: 'lax', // CSRF protection
            maxAge: 3600 // 1 hour
        }).ok(null, 'LOGIN_SUCCESS', null)
    });

    fastify.post('/logout', async (request, reply) => {
        reply.clearCookie('access_token').send({ message: 'Wylogowano' });
    });
}
