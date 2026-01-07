import repository from "./repository.js";

export async function loginUser(prisma, bcrypt, email, password) {
  const user = await repository(prisma).findByEmail(email);
  if (!user) return null;

  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) return null;

  return user;
}
