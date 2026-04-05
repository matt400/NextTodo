import { PrismaClient } from "@prismagl";

const userRepository = (prisma: PrismaClient) => ({
  updateData: async (id: string, data: object) => {
    await prisma.user.update({
      where: { id },
      data: data,
    });
  },

  removeUser: async (id: string) => {
    await prisma.user.delete({
      where: { id },
    });
  },
});

export default userRepository;
