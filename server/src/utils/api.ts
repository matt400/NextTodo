export function createToken(jwt: any, payload: any) {
  return jwt.sign(payload);
}

export const onlyGuest = async (request: any, reply: any) => {
  const token = request.cookies.access_token;
  if (token) {
    try {
      await request.jwtVerify();
      return reply.fail("ALREADY_REGISTERED", 403);
    } catch (err) {
      console.log("Weryfikacja JWT: BŁĄD ->", err);
    }
  }
};
