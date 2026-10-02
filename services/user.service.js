import { userModel } from '../model/user.model.js';

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const getUserOrThrow = async (id) => {
  const user = await userModel.findById(id);

  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  return user;
};

const ensureEmailIsAvailable = async (email, currentUserId) => {
  const existingUser = await userModel.findByEmail(email);

  if (existingUser && existingUser.id !== currentUserId) {
    throw createError('Email is already in use', 409, 'EMAIL_ALREADY_EXISTS');
  }
};

export const userService = {
  async listUsers() {
    return userModel.findAll();
  },

  async getUser(id) {
    return getUserOrThrow(id);
  },

  async createUser(data) {
    await ensureEmailIsAvailable(data.email);
    return userModel.create(data);
  },

  async updateUser(id, data) {
    const user = await getUserOrThrow(id);
    await ensureEmailIsAvailable(data.email, user.id);
    return userModel.update(id, data);
  },

  async deleteUser(id) {
    const user = await userModel.delete(id);
    return user ?? getUserOrThrow(id);
  }
};
