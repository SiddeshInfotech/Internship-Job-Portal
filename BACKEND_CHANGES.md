# Placify — Backend Changes Requested (v2)

**From:** Frontend (Suher) · **Updated:** 18 Jul 2026 · **Presentation: Monday**
Frontend v2 is fully wired for everything below — the moment an item ships on
the backend, it lights up automatically (no frontend rebuild needed unless the
API base URL changes). Priority order reflects the Monday demo.

---

## 1. REQUIRED FOR MONDAY

### 1.1 `GET /api/client/applicants/:id` — complete applicant payload
The company's applicant view now renders the **whole student profile**. Please
ensure the response includes (either flat, or nested under `student` — the
frontend flattens both):

| Field | Notes |
|---|---|
| `student_name` (or `name`) | currently missing → page showed no name |
| `email` (or `student_email`) | currently missing → shown with mailto link |
| `phone` | optional, shown if present |
| `gpa_cgpa` | send the raw DB column as-is — frontend reads `gpa_cgpa` directly |
| `resume_link` (any of `resume_url`/`resume_drive_link`/`resume`) | the Google Drive URL the student submitted |
| `cover_letter` | rendered in full |
| `skills` | array or comma-separated string — both fine |
| `certificates` | array of strings, or of `{ name, url }` objects |
| `profile_photo` | Cloudinary URL once ready (see 1.4) |
| `institution`, `department`, `applied_date`/`created_at`, `status` | as before |

Same completeness for the admin equivalent `GET /api/admin/applications/:id`.

### 1.2 Resume Drive links — sharing requirement
Frontend now **embeds the Drive file inline** (converts `/file/d/ID/view` →
`/file/d/ID/preview` in an iframe). This only renders if the file is shared as
**"Anyone with the link — Viewer."** Please:
- On the student apply endpoint, **validate** the submitted URL is a Drive/PDF
  link (regex `drive.google.com/file/d/` or `.pdf`), and
- Add a note in the student UI copy/API error: link must be set to "Anyone
  with the link" (otherwise companies see a Google permission page).
Frontend falls back to a "View Resume ↗" button for non-embeddable links.

### 1.3 CORS + change-password (carried over from v1, still open)
- `POST /api/student/change-password` — contract in v1 doc, UI already calls it.
- Add the deployed frontend origin to the Flask CORS allowlist.

### 1.4 Cloudinary student profile photo
When you wire Cloudinary, return the photo URL on student/applicant payloads as
**`profile_photo`** (frontend also accepts `profile_photo_url` / `photo_url` /
`avatar_url`). Nothing else needed — rendering + fallback initials are done.

---

## 2. EMAIL NOTIFICATIONS (all triggers, via existing Resend integration)
Resend HTTP API is already integrated for auth emails — hook these triggers
into the same sender. Suggested hook points are the existing action endpoints;
no new routes needed. All emails should include the Placify name + a link to
the relevant portal login.

| # | Trigger (endpoint) | To | Must include |
|---|---|---|---|
| E1 | Student applies (`POST /api/student/jobs/:id/apply`) | **Student** | Application ID, job title, company name, applied date, current status |
| E2 | Student applies (same trigger) | **Company** (HR email) | Student name, job title, link hint to portal applicants page |
| E3 | Application shortlisted/approved (`PATCH .../shortlist`, `.../extend-offer`) | Student | Job title, company, new status |
| E4 | Application rejected (`PATCH .../reject`) | Student | Job title, company, status (keep tone neutral/kind) |
| E5 | Job post approved by admin (`PATCH /api/admin/jobs/:id/approve`) | Company | Job title, "now live" confirmation |
| E6 | Job post rejected by admin (`PATCH /api/admin/jobs/:id/reject`) | Company | Job title, rejection reason if available |

Implementation notes:
- Send emails **after** the DB commit; wrap in try/except so an email failure
  never fails the API action (log it instead).
- Consider a tiny `send_email(to, subject, html)` helper reused by all six.
- Interview-scheduled / offer-extended can reuse E3's template with different
  wording.

---

## 3. STRONGLY RECOMMENDED (frontend has workarounds, but they cost requests)

### 3.1 Applicant counts on jobs lists
`GET /api/client/jobs` and `GET /api/admin/jobs` should include
`applications_count` per job (LEFT JOIN + COUNT, GROUP BY job id).
**Current workaround:** frontend fires one extra `per_page=1` request *per job*
to read `total` — works for the demo, wasteful at scale. Once the count field
ships, the workaround output is simply superseded.

### 3.2 Dates on all list rows
`created_at` on applications/jobs rows (frontend formats it). Carried from v1.

---

## 4. UNCHANGED / REFERENCE
- All action routes (approve/reject/block/shortlist/interview/offer/close) are
  called exactly as before — no contract changes.
- Field-name tolerance table and list-envelope handling: see v1 doc Section 4
  (still applies; additions above: `gpa_cgpa`, `profile_photo` variants,
  `certificates`/`certifications`, `cover_letter`).
- Optional items from v1 (stats endpoints, newsletter, notification prefs,
  CSV export) remain optional.

### 4.1 `PUT /api/client/profile` (company profile wizard) — payload format
The wizard saves each step with only that step's fields. Serialization used:
- `preferred_job_types` → **comma-separated string** (e.g. `"Full-Time, Internship, Hybrid"`)
- `terms_accepted` → **1 / 0** (int)
- everything else → plain strings
If the endpoint expects different types (e.g. a JSON array for job types) or
rejects unknown/partial keys, tell Suher which — the frontend can switch
same-day. If a step-3 save 500s, the raw error is now shown in the UI and
logged to the browser console for quick diagnosis.

**Questions:** ping Suher with the raw response JSON — frontend can usually
absorb naming differences same-day.
