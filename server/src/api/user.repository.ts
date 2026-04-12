import { PrismaClient, Prisma } from "@prismagl";

import type { UserUpdateData, UserSettings } from "@server/interfaces/IUser";

const userRepository = (prisma: PrismaClient) => ({
  updateData: (id: string, data: UserUpdateData) => {
    return prisma.user.update({
      where: { id },
      data: data as Prisma.UserUpdateInput,
    });
  },

  updateSettings: (id: string, settings: UserSettings) =>
    prisma.user.update({ where: { id }, data: { settings } }),

  removeUser: (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  },
});

export default userRepository;
