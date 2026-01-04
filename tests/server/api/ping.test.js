import buildApp from '@server/src/app';

test('Fastify works', async () => {
  const app = buildApp();
  const res = await app.inject({ method: 'GET', url: '/ping' });
  expect(res.statusCode).toBe(200);
});
