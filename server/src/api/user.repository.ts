import { Prisma, PrismaClient } from "@prismagl";
import { handlePrismaError } from "@server/utils/errors";

const userRepository = (prisma: PrismaClient) => ({
  updateData: async (id: string, data: object) => {
    try {
      await prisma.user.update({
        where: { id },
        data: data,
      });
    } catch (e) {
      handlePrismaError(e);
    }
  },
});

export default userRepository;
