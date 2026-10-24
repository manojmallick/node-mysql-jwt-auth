# Node.js Auth REST API with Express, MySQL and JWT

A small, readable authentication API: users sign up, sign in, and receive a JSON Web Token. Passwords are hashed with bcrypt, input is validated with Joi, and users are stored in MySQL. Use it as a starting point for the auth layer of a larger service.

> Based on [desirekaleba/node-mysql-jwt-auth](https://github.com/desirekaleba/node-mysql-jwt-auth), the upstream project the original README pointed to.

## Features

- Sign up with first name, last name, email and password
- Sign in and receive a JWT valid for one day
- Duplicate-email detection
- Request validation with clear error messages
- bcrypt password hashing; password hashes are never returned by the API
- Request and error logging (winston and morgan)
- Scripts to create and drop the database and tables

## Tech stack

Node.js, Express, MySQL (`mysql` driver), `jsonwebtoken`, `bcryptjs`, Joi, `cors`, `dotenv`, winston and morgan.

## Getting started

Requires Node.js and a running MySQL server.

```bash
git clone https://github.com/manojmallick/node-mysql-jwt-auth.git
cd node-mysql-jwt-auth
npm install
cp .env.example .env      # then edit the values (see below)
npm run db:init           # creates the database and the users table
npm start                 # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user (needs permission to create databases for `db:init`) |
| `DB_PASS` | MySQL password |
| `DB_NAME` | Database name to create and use |
| `JWT_SECRET_KEY` | Secret used to sign tokens. Use a long random value in any real deployment |
| `PORT` | Optional. HTTP port, default `3000` |

### Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the server |
| `npm run start:dev` | Start with nodemon (restarts on change) |
| `npm run db:up` | Create the database |
| `npm run tables:up` | Create the tables |
| `npm run db:init` | `db:up` then `tables:up` |
| `npm run db:down` | Drop the database (deletes all data) |

## API

Base path: `/api/auth`. Requests and responses are JSON.

### `POST /api/auth/signup`

```json
{ "firstname": "Jane", "lastname": "Doe", "email": "jane@example.com", "password": "secret123" }
```

Validation: `firstname` and `lastname` are alphanumeric, 3 to 50 characters; `email` must be a valid email; `password` is 6 to 30 letters or digits.

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Jane","lastname":"Doe","email":"jane@example.com","password":"secret123"}'
```

Success (`201`):

```json
{
  "status": "success",
  "data": {
    "token": "<jwt>",
    "data": { "id": 1, "firstname": "Jane", "lastname": "Doe", "email": "jane@example.com" }
  }
}
```

### `POST /api/auth/signin`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

Success (`200`):

```json
{
  "status": "success",
  "data": { "token": "<jwt>", "firstname": "Jane", "lastname": "Doe", "email": "jane@example.com" }
}
```

### Errors

All errors use `{ "status": "error", "message": "..." }`.

| Status | When |
|---|---|
| `400` | Validation failed, or the email is already registered (signup) |
| `401` | Wrong password (signin) |
| `404` | No user with that email (signin) |
| `500` | Database or server error |

### Using the token

The token payload is `{ "id": <user id> }` and it expires after one day. `src/utils/token.js` exports `generate` and `decode`, but **no route in this project checks the token yet**. To protect a route, add a middleware that reads `Authorization: Bearer <token>` and calls `decode`.

## Project structure

```
src/
├── index.js, app.js        Server start-up; Express app and routes
├── routes/auth.route.js    /signup and /signin
├── controllers/            Request handling
├── validators/             Joi schemas
├── middlewares/            asyncHandler, checkEmail (duplicate check), validatorHandler
├── models/user.model.js    MySQL queries for users
├── database/               SQL (queries.js) and db:up / db:down / tables:up scripts
├── config/                 MySQL connection
└── utils/                  JWT (token.js), bcrypt (password.js), env (secrets.js), logger
```

## Notes and limitations

- Only sign-up and sign-in exist: no password reset, email verification, refresh tokens or token-protected routes.
- There are no automated tests.
- `npm run db:down` drops the whole database named in `DB_NAME`.
- `package.json` declares the ISC license; there is no LICENSE file in the repository.
