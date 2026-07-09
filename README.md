# Placify Client (Company) Backend

Python/Flask backend for the Client/Company side of Placify — mirrors
the Student backend's structure and patterns exactly, but for the
Client/Company entity.

## Folder Structure
```
backend/
    app.py
    routes/client_routes.py
    controllers/client_controller.py
    models/client.py            # Auto MySQL/in-memory fallback
    config/
        config.py
        database.py              # Shared pattern with Student backend
        email_service.py         # Real Gmail SMTP sending
    .env.example
    requirements.txt
```

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # or venv\bin\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in real values (DB + Gmail).

```bash
python app.py
```

Runs on **port 5001** by default (different from the Student backend's
5000) so both can run at the same time on one machine during testing.

Check the console — it clearly shows which storage mode is active:
```
[MODE] Using REAL MySQL database.
```
or
```
[MODE] DB not configured/reachable — using IN-MEMORY storage.
```
No code changes needed to switch — just fill in DB credentials in `.env`.

## Current Status — all tested end-to-end
- ✅ Automatic MySQL / in-memory fallback (same pattern as Student backend)
- ✅ Register — creates account as **unverified**, sends OTP
- ✅ OTP Verification
- ✅ Resend OTP (blocks resending on already-verified accounts)
- ✅ Login — blocked until OTP verified
- ✅ Forgot Password — real email with reset link
- ✅ Reset Password
- ✅ Duplicate email registration blocked (409)

## API Endpoints
(All under `http://127.0.0.1:5001`)

### 1. Register
`POST /api/client/register`
```json
{
  "company_name": "Nimbus Technologies",
  "email": "hr@nimbus.com",
  "password": "CompanyPass123",
  "industry": "IT Services",
  "website": "https://nimbus.com"
}
```

### 2. Verify OTP
`POST /api/client/verify-otp`
```json
{ "email": "hr@nimbus.com", "otp": "123456" }
```

### 3. Resend OTP
`POST /api/client/resend-otp`
```json
{ "email": "hr@nimbus.com", "purpose": "registration" }
```

### 4. Login
`POST /api/client/login`
```json
{ "email": "hr@nimbus.com", "password": "CompanyPass123" }
```

### 5. Forgot Password
`POST /api/client/forgot-password`
```json
{ "email": "hr@nimbus.com" }
```

### 6. Reset Password
`POST /api/client/reset-password`
```json
{
  "token": "token-from-the-email",
  "new_password": "NewSecurePass123",
  "confirm_password": "NewSecurePass123"
}
```

## Database tables
Separate table names from the Student backend, so both can safely
share the same `placement_portal_db` database without collisions:
```sql
clients (id, company_name, email, password_hash, industry, website,
         is_verified, created_at)
client_password_resets (id, email, token, expires_at, created_at)
client_otp_verifications (id, email, otp_code, purpose, expires_at,
                           is_used, attempts, created_at)
```
All created automatically on server startup once DB is reachable.

## Notes
- Passwords always hashed (`werkzeug.security`), never stored plain.
- Google Sign-In was not part of this task — only built for Student.
  If needed later, the pattern in the Student backend's
  `config/google_auth.py` can be reused here directly.
