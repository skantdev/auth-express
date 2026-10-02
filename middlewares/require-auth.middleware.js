import { authCookieName } from '../config/auth.js';
import { authService } from '../services/auth.service.js';

export const requireAuth = async (req, res, next) => {
  const token = req.cookies?.[authCookieName];

  if (!token) {
    return res.redirect('/login');
  }

  try {
    req.authUser = await authService.getUserFromToken(token);

    if (!req.authUser) {
      res.clearCookie(authCookieName, { path: '/' });
      return res.redirect('/login');
    }

    next();
  } catch {
    res.clearCookie(authCookieName, { path: '/' });
    res.redirect('/login');
  }
};