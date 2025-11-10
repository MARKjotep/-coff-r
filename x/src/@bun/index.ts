export const Digest = (secret: string, ...salt: string[]) => {
  const hmac = new Bun.CryptoHasher("sha256", secret);
  salt.forEach((ss) => {
    hmac.update(ss);
  });
  return hmac.digest();
};
