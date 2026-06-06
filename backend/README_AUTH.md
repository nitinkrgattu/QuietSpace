Local authentication (JWT) setup

This project was originally using Supabase Auth. You've opted to use local JWT-based
authentication while still storing application data in the Supabase Postgres database.

What I changed:
- Implemented backend endpoints at `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/profile`.
- Endpoints use `local_users` Postgres table to store credentials (salted PBKDF2-SHA256 hashes).
- JWTs are signed using `SECRET_KEY` from `app.config.Settings`.
- Frontend updated to store the JWT in `localStorage` under `quietspace_token` and to use it for API requests.

Database migration:
- Run `database/local_auth.sql` against your Postgres (Supabase) database to create the `local_users` table.
- Then run `database/local_seed.sql` to add demo/sample local-auth users and sample tasks, sessions, and recommendations.
- Existing profile/task/session/recommendation rows are preserved. The local auth migration creates placeholder `local_users` records for existing user IDs before moving foreign keys.
- Migrated placeholder accounts and the demo account use password `demo123456`.

Limitations & migration notes:
- Existing tables (`profiles`, `tasks`, `focus_sessions`) reference `auth.users(id)` (Supabase Auth). They will not be automatically linked to `local_users`.
- If you want preexisting data linked to new local users, you will need to:
  1. Create corresponding rows in the `profiles` table with the same UUIDs used for `local_users` (not recommended unless you fully migrate off Supabase Auth).
  2. Or adapt other routes to use `local_users` ids and tables instead of `auth.users`.

Environment variables:
- Ensure `SECRET_KEY` is set in your backend `.env` (used to sign JWTs). It already exists in `app.config.Settings`.

Security notes:
- The local auth implementation is intentionally simple for dev/test use. Before using in production consider:
  - Adding email verification flows
  - Adding rate-limiting and CAPTCHA for registration
  - Storing refresh tokens and supporting token revocation
  - Using a hardened password policy and secure secrets management

If you want, I can also:
- Add a migration script to copy existing supabase `auth.users` into `local_users` (if you plan to fully move off Supabase Auth).
- Replace `profiles` and other tables' FKs to point to `local_users` and migrate data.
