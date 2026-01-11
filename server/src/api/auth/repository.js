const authRepository = (prisma) => ({
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),

  create: (data) => prisma.user.create({ data: data }),

  updatePassword: (id, password) =>
    prisma.user.update({
      where: { id },
      data: { password },
    }),
});

export default authRepository;
