import type { PrismaClient } from "@prisma/client";

const authRepository = (prisma: PrismaClient) => ({
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findByUsername: (username: string) =>
    prisma.user.findUnique({ where: { username } }),

  create: (data: any) => prisma.user.create({ data: data }),

  updatePassword: (id: number, password: string) =>
    prisma.user.update({
      where: { id },
      data: { password },
    }),
});

export default authRepository;
