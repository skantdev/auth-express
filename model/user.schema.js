/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const USER_SCHEMA = Object.freeze({
  id: 'string',
  name: 'string',
  email: 'string',
  createdAt: 'string',
  updatedAt: 'string'
});

export const USER_INPUT_SCHEMA = Object.freeze({
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    type: 'string',
    required: true,
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});

/**
 * @param {unknown} input
 * @returns {{name: string, email: string, errors: string[]}}
 */
export const parseUserInput = (input) => {
  const body = input && typeof input === 'object' ? input : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const errors = [];

  if (name.length < USER_INPUT_SCHEMA.name.minLength) {
    errors.push('name must be at least 2 characters');
  } else if (name.length > USER_INPUT_SCHEMA.name.maxLength) {
    errors.push('name must not exceed 100 characters');
  }

  if (!USER_INPUT_SCHEMA.email.pattern.test(email)) {
    errors.push('email must be a valid email address');
  } else if (email.length > USER_INPUT_SCHEMA.email.maxLength) {
    errors.push('email must not exceed 254 characters');
  }

  return { name, email, errors };
};