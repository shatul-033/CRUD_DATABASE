# Task Manager Backend (Node + Express + MySQL)

This project implements a Task Manager backend using raw MySQL queries (no ORM), JWT-based authentication, and role-based access control (RBAC). It's configured to work with XAMPP MySQL — change `.env` values appropriately.

## Features
- User registration & login (passwords hashed with bcrypt).
- JWT authentication for protected routes.
- Role-based access: `admin` and `user`.
- Tasks belong to users (one-to-many). Users can only CRUD their own tasks; admins can manage all tasks.
- Core MySQL queries via `mysql2` (promise API), no ORM.

## Setup (Windows + XAMPP)
1. Install Node.js (v16+ recommended).
2. Start MySQL via XAMPP (or ensure MySQL server running).
3. Create a database, for example `task_manager`.
4. Import `sql/schema.sql` into your MySQL (via phpMyAdmin or `mysql` CLI):
   - phpMyAdmin: select your DB -> Import -> choose `sql/schema.sql`.
   - CLI: `mysql -u root -p < sql/schema.sql` (or adjust user/host).
5. Copy `.env.example` to `.env` and update values (DB user/password, JWT secret).
6. Install dependencies:
   ```bash
   npm install
   ```
7. Run server:
   ```bash
   npm run dev   # requires nodemon installed
   # or
   npm start
   ```

## API Endpoints (summary)
- `POST /api/auth/register` — register user. Body: `{ username, email, password, role? }`
- `POST /api/auth/login` — login. Body: `{ email, password }`
- `GET /api/tasks` — list tasks (authenticated). Regular users see only their tasks; admin sees all.
- `POST /api/tasks` — create task. Body: `{ title, description, status? }`
- `GET /api/tasks/:id` — get task by id (authorized).
- `PUT /api/tasks/:id` — update task (authorized).
- `DELETE /api/tasks/:id` — delete task (authorized).


