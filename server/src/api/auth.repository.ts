import { PrismaClient } from "@prismagl";

const authRepository = (prisma: PrismaClient) => ({
  findByEmail: async (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findByUsername: async (username: string) =>
    prisma.user.findUnique({ where: { username } }),

  create: async (data: any) => prisma.user.create({ data: data }),

  updatePassword: async (id: string, password: string) =>
    prisma.user.update({
      where: { id },
      data: { password },
    }),
});

export default authRepository;
