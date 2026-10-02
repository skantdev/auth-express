import { userService } from '../services/user.service.js';

const responseMeta = (req) => ({
  requestId: req.get('X-Request-Id'),
  clientId: req.clientId
});

export const listUsers = async (req, res, next) => {
  try {
    res.json({ success: true, data: await userService.listUsers(), meta: responseMeta(req) });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    res.json({ success: true, data: await userService.getUser(req.params.id), meta: responseMeta(req) });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.validatedUser);
    res.cookie('session_id', user.id, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ success: true, data: user, meta: responseMeta(req) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.validatedUser);
    res.cookie('session_id', user.id, { httpOnly: true, sameSite: 'lax' });
    res.json({ success: true, data: user, meta: responseMeta(req) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.clearCookie('session_id');
    res.json({ success: true, data: deletedUser, meta: responseMeta(req) });
  } catch (error) {
    next(error);
  }
};

