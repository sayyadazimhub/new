import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import crypto from 'crypto';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'atms-jwt-secret');
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token (jose - works in Node and Edge)
 */
export async function generateToken(payload) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
  return token;
}

/**
 * Verify a JWT token (jose - works in Node and Edge)
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, secret(), {
      maxAge: expiresIn,
    });
    return payload;
  } catch {
    return null;
  }
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function verifyAuth(request) {
  try {
    const token = request.cookies.get('user-token')?.value || request.cookies.get('token')?.value || request.cookies.get('auth-token')?.value;
    if (!token) {
      return null;
    }
    const decoded = await verifyToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export { generateToken as signUserToken, verifyToken as verifyUserToken, verifyToken as verifyUserTokenEdge };
