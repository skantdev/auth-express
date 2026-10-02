import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser
} from '../controllers/user.controller.js';
import { validateUser } from '../validators/user.validator.js';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validateUser, createUser);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', deleteUser);

export default router;