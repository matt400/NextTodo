import repository from "./repository.js";

export async function loginUser(prisma, bcrypt, email, password) {
  const user = await repository(prisma).findByEmail(email);
  if (!user) return null;

  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) return null;

  return user;
}

export async function registerUser(prisma, bcrypt, userData) {
  const existingEmail = await repository(prisma).findByEmail(userData.email);
  if (existingEmail) return 2;

  const existingUsername = await repository(prisma).findByUsername(
    userData.username,
  );
  if (existingUsername) return 3;

  const password = await bcrypt.hash(userData.password, 10);
  const createUser = await repository(prisma).create({
    username: userData.username,
    email: userData.email,
    password: password,
    isActive: true,
    lastLogin: new Date().toISOString(),
  });
  console.log(`User registered ${JSON.stringify(createUser.JSON)}`);
  return false;
}
