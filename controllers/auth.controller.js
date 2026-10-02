import { authCookieName, authCookieOptions } from '../config/auth.js';
import { authService } from '../services/auth.service.js';

export const showLogin = (req, res) => {
  res.render('login', { error: null, email: '' });
};

export const showSignup = (req, res) => {
  res.render('signup', { error: null, name: '', email: '' });
};

export const signup = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.cookie(authCookieName, token, authCookieOptions);
    res.redirect('/dashboard');
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).render('signup', {
        error: error.message,
        name: req.body.name ?? '',
        email: req.body.email ?? ''
      });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token } = await authService.login(req.body);
    res.cookie(authCookieName, token, authCookieOptions);
    res.redirect('/dashboard');
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).render('login', {
        error: error.message,
        email: req.body.email ?? ''
      });
    }
    next(error);
  }
};

export const showDashboard = (req, res) => {
  res.render('dashboard', { user: req.authUser });
};

export const logout = (req, res) => {
  res.clearCookie(authCookieName, { path: '/' });
  res.redirect('/login');
};