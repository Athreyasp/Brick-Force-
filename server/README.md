# Brick Force Backend Security API

A hardened, zero-trust backend architecture designed to ensure that passwords, cryptographic salts, session secrets, and candidate PII are **never stored on the frontend**.

## Security Architecture Overview
1. **Server-Side PBKDF2 / SHA-512 Hashing**: 10,000 iterations of salted hashing on the server.
2. **httpOnly SameSite=Strict Cookies**: Authentication issues signed tokens in `Set-Cookie: bf_session=...; HttpOnly; SameSite=Strict`. Client JavaScript (including malicious XSS injection) cannot read the token.
3. **Server-Side Intrusion Detection & Rate Limiting**: Automatic IP lockout after 5 consecutive failed login attempts.
4. **Zero Frontend Secrets**: The frontend only receives user role metadata (`SUPER_ADMIN`) and never has access to the cryptographic hash or master keys.
5. **Audited Data Access**: Every access, mutation, login, or rejection is immutably logged on the server.

## Quick Start
To launch the backend API:
```bash
node server/server.cjs
```
The server will run on `http://localhost:5000`.

## API Endpoints
- `POST /api/auth/login` - Rate-limited login (checks PBKDF2 hash, issues httpOnly cookie)
- `POST /api/auth/logout` - Revokes cookie session
- `GET /api/auth/me` - Verifies session and returns current admin context
- `POST /api/auth/change-password` - Re-hashes and updates password on the server
- `GET /api/applicants` - Protected applicant candidate stream
- `POST /api/applicants` - Public sanitized application submission
- `PUT /api/applicants/:id` - Protected candidate update / notes
- `DELETE /api/applicants/:id` - Protected applicant deletion
- `GET /api/jobs` - Public / Admin job openings
- `POST /api/jobs` - Protected job creation
- `PUT /api/jobs/:id` - Protected job editor
- `DELETE /api/jobs/:id` - Protected job deletion
- `GET /api/reviews` - Testimonial list
- `PUT /api/reviews/:id` - Protected review approval toggle
- `DELETE /api/reviews/:id` - Protected review deletion
- `GET /api/security/logs` - Protected live server audit log
- `DELETE /api/security/logs` - Clear audit logs
