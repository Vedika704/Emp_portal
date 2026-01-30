import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secretkey";

export function encryptToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function decryptToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null; 
  }
}
