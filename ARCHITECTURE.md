# Express Project Architecture

## Purpose

This document defines the structure and rules for the Express.js application. New features should follow these boundaries unless there is a clear reason to extend the architecture.

## Directory Structure

```text
.
├── index.js              # Application entry point and server startup
├── config/               # Environment and external service configuration
├── routes/               # HTTP routes and route-level middleware
├── controllers/          # Request/response handling
├── services/             # Business logic and orchestration
├── model/                # Database models and data access
├── views/                 # Server-rendered EJS pages
├── public/                # Static browser assets
├── validators/           # Request input validation and schemas
├── middlewares/          # Shared Express middleware
└── utils/                # Small reusable helpers with no business logic
```

## Local MongoDB

The application uses Mongoose with a local MongoDB database named `express_app`.
The default connection is:

```text
mongodb://127.0.0.1:27017/express_app
```

Set `MONGO_URL` when using a different MongoDB instance. MongoDB must be running
before `npm start` is executed.

Copy `.env.example` to `.env` to configure `MONGO_URL` and `JWT_SECRET`. Use a
unique, long random value for `JWT_SECRET` outside local development.

## Authentication Pages

- `GET /signup` and `POST /signup` create an account.
- `GET /login` and `POST /login` authenticate an account.
- `GET /dashboard` requires a valid `auth_token` HTTP-only cookie.
- `POST /logout` clears the authentication cookie.

Passwords are hashed with bcrypt before storage. The password hash is excluded
from normal user queries and is never included in API or view responses.

## Request Flow

Requests should move through the application in this order:

```text
Client
  -> Route
  -> Validation middleware
  -> Authentication/authorization middleware
  -> Controller
  -> Service
  -> Model/data access
  -> Service
  -> Controller response
  -> Client
```

Errors should be passed to the centralized error-handling middleware.

## Layer Responsibilities

### `index.js`

- Create and configure the Express application.
- Register global middleware and routes.
- Register the error handler last.
- Start the HTTP server.
- Do not place feature-specific business logic here.

### `routes/`

- Define URL paths and HTTP methods.
- Connect middleware and controllers.
- Keep handlers short.
- Do not access the database directly.

### `controllers/`

- Read request data and authenticated user information.
- Call the appropriate service.
- Return the correct HTTP status and response body.
- Pass failures to `next(error)`.
- Do not contain complex business rules.

### `services/`

- Contain business rules and use-case logic.
- Coordinate models and external services.
- Remain independent of Express request and response objects.
- Throw typed or meaningful errors when an operation fails.

### `model/`

- Define Mongoose schemas, data models, and persistence operations.
- Keep database-specific logic in this layer.
- Do not format HTTP responses or access `req`/`res`.

### `validators/`

- Validate request body, query parameters, and route parameters.
- Reject invalid input before the controller runs.
- Keep validation schemas reusable and explicit.

### `middlewares/`

- Implement cross-cutting concerns such as authentication, authorization, logging, rate limiting, and error handling.
- Keep middleware focused on one responsibility.

### `config/`

- Load environment variables and application configuration.
- Validate required configuration at startup.
- Never hard-code secrets, tokens, or production credentials.

### `utils/`

- Hold small, generic helpers.
- Do not use this directory as a dumping ground for business logic.
- Prefer a feature-specific service when logic belongs to one feature.

## Coding Rules

1. Use ES modules, matching the existing `"type": "module"` configuration.
2. Use `async`/`await` for asynchronous code.
3. Keep controllers thin and services responsible for business logic.
4. Validate all external input before using it.
5. Never trust client-provided identity or authorization data.
6. Use environment variables for ports, secrets, database URLs, and external credentials.
7. Return consistent JSON responses for API endpoints.
8. Use appropriate HTTP status codes.
9. Do not expose stack traces, secrets, SQL errors, or internal implementation details in production responses.
10. Use centralized error handling instead of repeating `try/catch` response logic in every route.
11. Keep functions small and name them after the operation they perform.
12. Avoid modifying unrelated files when implementing a feature.

## API Conventions

- Use plural resource names, for example `/users` and `/orders`.
- Use HTTP methods according to their intent: `GET`, `POST`, `PATCH`, and `DELETE`.
- Version public APIs when compatibility may change, for example `/api/v1/users`.
- Return JSON with a predictable shape.
- Use pagination for collection endpoints that can grow large.
- Do not return passwords, tokens, or other sensitive fields.

Example response shapes:

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request data is invalid"
  }
}
```

## Security Baseline

- Store secrets in environment variables.
- Hash passwords with a suitable password-hashing algorithm.
- Verify JWTs in authentication middleware and keep authorization separate.
- Validate and sanitize user input.
- Configure CORS deliberately for the environments that need it.
- Add rate limiting to authentication and other sensitive endpoints.
- Log useful request information without logging credentials or tokens.

## Feature Implementation Checklist

Before considering a feature complete:

- [ ] Add or update validation.
- [ ] Add the model/data access code if persistence is required.
- [ ] Add business logic in a service.
- [ ] Add a controller for HTTP translation.
- [ ] Register a route and required middleware.
- [ ] Add centralized error handling for new failure cases.
- [ ] Add tests for success, validation failure, authorization failure, and service failure.
- [ ] Confirm secrets and configuration are not hard-coded.
- [ ] Run the application with `npm start` and verify the affected endpoint.
