export function createToken(jwt, payload) {
  return jwt.sign(payload);
}
