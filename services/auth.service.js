import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authCookieName, jwtSecret } from '../config/auth.js';
import { userModel } from '../model/user.model.js';

const authError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateCredentials = ({ name, email, password }, requireName) => {
  if (requireName && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) {
    throw authError('Name must be between 2 and 100 characters.', 400, 'INVALID_NAME');
  }

  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw authError('Enter a valid email address.', 400, 'INVALID_EMAIL');
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    throw authError('Password must be between 8 and 72 characters.', 400, 'INVALID_PASSWORD');
  }
};

export const authService = {
  async register({ name, email, password }) {
    validateCredentials({ name, email, password }, true);
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await userModel.findByEmail(normalizedEmail);

    if (existingUser) {
      throw authError('An account with this email already exists.', 409, 'EMAIL_ALREADY_EXISTS');
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await userModel.create({ name: name.trim(), email: normalizedEmail, passwordHash });
      return { user, token: jwt.sign({}, jwtSecret, { subject: user.id, expiresIn: '1d' }) };
    } catch (error) {
      if (error.code === 11000) {
        throw authError('An account with this email already exists.', 409, 'EMAIL_ALREADY_EXISTS');
      }
      throw error;
    }
  },

  async login({ email, password }) {
    validateCredentials({ email, password }, false);
    const userRecord = await userModel.findByEmailForAuth(normalizeEmail(email));

    if (!userRecord?.passwordHash || !(await bcrypt.compare(password, userRecord.passwordHash))) {
      throw authError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS');
    }

    const user = publicUser(userRecord);
    return { user, token: jwt.sign({}, jwtSecret, { subject: user.id, expiresIn: '1d' }) };
  },

  async getUserFromToken(token) {
    const payload = jwt.verify(token, jwtSecret);
    const user = await userModel.findById(payload.sub);
    return user;
  },

  getCookieName() {
    return authCookieName;
  }
};