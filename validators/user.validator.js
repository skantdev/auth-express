import { parseUserInput } from '../model/user.schema.js';

export const validateUser = (req, res, next) => {
  const { name, email, errors } = parseUserInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request data is invalid',
        details: errors
      }
    });
  }

  req.validatedUser = {
    name: name.trim(),
    email: email.trim().toLowerCase()
  };
  next();
};
