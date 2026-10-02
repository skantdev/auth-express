import { Router } from 'express';
import { authCookieName } from '../config/auth.js';
import {
  login,
  logout,
  showDashboard,
  showLogin,
  showSignup,
  signup
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/require-auth.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.redirect(req.cookies?.[authCookieName] ? '/dashboard' : '/login');
});
router.get('/login', showLogin);
router.post('/login', login);
router.get('/signup', showSignup);
router.post('/signup', signup);
router.get('/dashboard', requireAuth, showDashboard);
router.post('/logout', requireAuth, logout);

export default router;