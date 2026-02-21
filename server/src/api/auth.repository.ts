import type { PrismaClient } from "@prismagl";

const authRepository = (prisma: PrismaClient) => ({
  findByEmail: async (email: string) =>
    await prisma.user.findUnique({ where: { email } }),

  findByUsername: async (username: string) =>
    await prisma.user.findUnique({ where: { username } }),

  create: async (data: any) => await prisma.user.create({ data: data }),

  updatePassword: async (id: string, password: string) =>
    await prisma.user.update({
      where: { id },
      data: { password },
    }),
});

export default authRepository;
