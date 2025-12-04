import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_REC || 'super_secret_jwt_key_20251609';

export interface CurrentUser {
  userId: string;
}

/**
 * Extract and validate the current user from the session cookie
 * Returns the userId if authenticated, otherwise throws an error
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session');

  if (!cookie) {
    throw new Error('Not authenticated');
  }

  try {
    const decoded: any = jwt.verify(cookie.value, JWT_SECRET);
    return { userId: decoded.userId };
  } catch (error) {
    throw new Error('Invalid session');
  }
}
