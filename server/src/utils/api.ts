export function createToken(jwt: any, payload: any) {
  return jwt.sign(payload);
}
