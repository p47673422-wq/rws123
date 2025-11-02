import jwt, { SignOptions } from 'jsonwebtoken';

const COOKIE_NAME = 'marathon_token';
const SECRET: string | undefined = process.env.MARATHON_JWT_SECRET;

export function createToken(payload: object, expiresIn = 3600) {
  if (!SECRET) throw new Error('MARATHON_JWT_SECREAT not set');
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string) {
  if (!SECRET) throw new Error('MARATHON_JWT_SECREAT not set');
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (e) {
    return null;
  }
}

export { COOKIE_NAME };
