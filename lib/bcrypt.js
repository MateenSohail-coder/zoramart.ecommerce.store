import bcrypt from "bcrypt";
export async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  return hash;
}
export async function verifyPassword(plainPassword, hashPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashPassword);
  return isMatch;
}
export function getOtpNumber() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return 100000 + (array[0] % 900000);
}
