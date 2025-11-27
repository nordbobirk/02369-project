import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Generates a long secure code (64 characters) and a salted hash.
 * Ideal for Magic Links where the user doesn't need to type the code.
 */
export function generateOTPData() {
  // Generate 32 bytes of entropy -> converts to a 64-character hex string
  // Example output: "a1b2c3d4..." (very long)
  const code = randomBytes(32).toString("hex");
  
  const salt = randomBytes(16).toString("hex");
  const hashBuffer = scryptSync(code, salt, 64) as Buffer;
  const hash = `${salt}:${hashBuffer.toString("hex")}`;
  
  return { code, hash };
}

/**
 * Verifies a user input OTP against the stored hash.
 */
export function verifyOTP(inputCode: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const hashedBuffer = scryptSync(inputCode, salt, 64) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");

  return timingSafeEqual(hashedBuffer, keyBuffer);
}