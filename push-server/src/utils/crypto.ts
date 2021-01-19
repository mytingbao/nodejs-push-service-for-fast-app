export {};
const crypto = require("crypto");
export function sha256(str: string) {
  const hash = crypto.createHash("sha256");
  return hash.update(str).digest("hex");
}
export function md5(str: string) {
  const hash = crypto.createHash("md5");
  return hash.update(str).digest("hex");
}
