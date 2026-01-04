import prisma from '@server/src/prisma'; // import prisma singleton 

test('database works', async () => {
  const count = await prisma.user.count();
  expect(typeof count).toBe('number');
});
