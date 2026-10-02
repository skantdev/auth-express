import { randomUUID } from 'node:crypto';

export const requestContext = (req, res, next) => {
  const requestId = req.headers['x-request-id'] ?? randomUUID();
  req.clientId = req.headers['x-client-id'] ?? null;
  res.setHeader('X-Request-Id', requestId);
  next();
};
