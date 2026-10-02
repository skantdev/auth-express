# Express Authentication and Users API

Express.js application with server-rendered signup/login pages, cookie-based authentication, and a MongoDB-backed users API.

## Requirements

- Node.js 20 or later
- MongoDB Community Server running locally, or another reachable MongoDB instance

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file in the project root:

```env
MONGO_URL=mongodb://127.0.0.1:27017/express_app
JWT_SECRET=replace-with-a-long-random-secret
```

Use a unique, randomly generated `JWT_SECRET`. Do not commit `.env`. If `MONGO_URL` is omitted, the application uses the local URL shown above.

Start MongoDB, then start the application:

```powershell
npm start
```

Open [http://localhost:3000](http://localhost:3000). The root page redirects to login or the dashboard based on the authentication cookie.

## Authentication Pages

| Method | Path | Description |
| --- | --- | --- |
| GET | `/signup` | Render account registration form |
| POST | `/signup` | Register account and sign in |
| GET | `/login` | Render login form |
| POST | `/login` | Authenticate and sign in |
| GET | `/dashboard` | View the authenticated user's account |
| POST | `/logout` | Clear the authentication cookie |

Passwords are hashed with bcrypt before storage. Authentication uses a signed JWT in an HTTP-only cookie. The dashboard requires a valid cookie.

## Users API

Base URL: `/api/v1/users`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/users` | List users |
| GET | `/api/v1/users/:id` | Get one user |
| POST | `/api/v1/users` | Create a user |
| PUT | `/api/v1/users/:id` | Replace a user's name and email |
| DELETE | `/api/v1/users/:id` | Delete a user |

Create and update requests accept JSON:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```

The API validates names and email addresses. Email addresses must be unique. The API endpoints are separate from the browser login flow.

## Project Layout

- `config/`: MongoDB and authentication configuration
- `controllers/`: HTTP request and response handling
- `middlewares/`: request context, authentication, and error handling
- `model/`: Mongoose user schema and data access
- `public/`: browser stylesheets
- `routes/`: authentication and users routes
- `services/`: authentication and user business logic
- `validators/`: request validation
- `views/`: EJS authentication and dashboard pages

See [ARCHITECTURE.md](ARCHITECTURE.md) for project conventions and layer responsibilities.
