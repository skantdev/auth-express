import 'dotenv/config';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production');
}

export const jwtSecret = process.env.JWT_SECRET ?? 'local-development-secret-change-before-production';
export const authCookieName = 'auth_token';
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
};