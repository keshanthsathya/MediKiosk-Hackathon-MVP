# MediKiosk Backend

Node.js + Express backend for the MediKiosk hospital patient-intake app.
Database: Supabase (Postgres + Storage). AI: Anthropic API for clinical
history structuring. Everything lives in a single file, `server.js`.

## Setup

1. **Create a Supabase project** (free tier) at [supabase.com](https://supabase.com).
   Grab the **Project URL** and the **service_role** API key from
   Project Settings → API.

2. **Create the database tables.** Open the Supabase SQL editor and run
   the contents of `migration.sql`.

3. **Create a Storage bucket** named `documents` (or whatever you set
   `SUPABASE_STORAGE_BUCKET` to) in the Supabase dashboard → Storage.
   Make it public if you want `file_url` links to be directly viewable,
   or private if you'll generate signed URLs yourself later.

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Configure environment variables.** Copy `.env.example` to `.env`
   and fill in the values:
   ```bash
   cp .env.example .env
   ```

6. **Run the server:**
   ```bash
   npm start
   # or, for auto-restart on changes:
   npm run dev
   ```

7. **Test endpoints** with Postman / Thunder Client before wiring up
   the real frontends. Start with `GET /health`.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `3000`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key (server-side only, never expose to clients) |
| `ANTHROPIC_API_KEY` | Anthropic API key, used to structure clinical narrations |
| `ANTHROPIC_MODEL` | Model name (default `claude-sonnet-4-5`) |
| `JWT_SECRET` | Secret used to sign doctor login JWTs |
| `JWT_EXPIRES_IN` | JWT expiry (default `12h`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` | SMTP relay credentials for sending report emails (e.g. Gmail app password, Mailtrap, Brevo) |
| `SMTP_FROM` | From-address for outgoing report emails |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for uploaded documents (default `documents`) |
| `PUBLIC_BASE_URL` | Base URL used to build the report link included in emails |

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check → `{status: "ok"}` |
| POST | `/patient/register` | Registers a patient, generates a sequential-per-day token |
| POST | `/patient/history` | Saves raw history fields, structures `rawNarration` via Anthropic, saves & returns the structured summary |
| POST | `/patient/documents` | Multipart upload → Supabase Storage + Tesseract.js OCR, saves a document record |
| POST | `/sos/:patientId` | Sets `sos_flag = true` on the patient |
| GET | `/patient/:patientId/summary` | Full patient record joined with histories and documents |
| POST | `/doctor/upload/:patientId` | Same as `/patient/documents` but tagged with the uploading practitioner |
| POST | `/report/send/:patientId` | Builds an HTML clinical report and emails it to the patient |
| POST | `/doctor/login` | Validates (or auto-creates, for hackathon speed) a practitioner, returns a JWT |
| GET | `/queue/today` | Today's patients, sorted by `sos_flag DESC, token ASC` |

All routes have try/catch error handling and return JSON `{error}` bodies
with appropriate 400/404/500 status codes on failure.

## Notes

- CORS is enabled for all origins — tighten this before production.
- The `/doctor/login` auto-create behavior is intentionally permissive
  for hackathon speed; add real practitioner vetting before production use.
- OCR failures are logged but don't fail the upload — `ocrText` will just
  come back as an empty string if Tesseract can't extract anything.
- `red_flags = true` from the Anthropic structuring step also raises the
  patient's `sos_flag`, so a red-flag narration surfaces in `/queue/today`.
