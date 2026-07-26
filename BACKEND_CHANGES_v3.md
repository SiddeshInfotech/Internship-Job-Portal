# Placify — Backend Changes Requested (v3)

**From:** Frontend (Suher) · **Updated:** 21 Jul 2026
Supersedes nothing in v1/v2 — those items still stand. This doc covers only
what the **latest frontend batch** needs. Everything below is already wired
on the frontend and will start working the moment the backend supports it.

---

## 1. NEW FIELDS — Student registration & profile

### 1.1 `POST /api/student/register` — experience fields
Registration now asks every student whether they're a fresher or experienced.
Two new fields are sent:

| Field | Type | Notes |
|---|---|---|
| `experience_level` | string | `"Fresher"` or `"Experienced"` |
| `years_of_experience` | number | `0` for freshers; required (>0) when Experienced |

Please add both columns to the `students` table and persist them on register.

### 1.2 `PUT /api/student/profile` — work experience block
Profile wizard Step 2 now lets an experienced student record one job. New
fields sent in the same partial-update payload as the other Step 2 fields:

| Field | Type | Example |
|---|---|---|
| `experience_level` | string | `"Experienced"` |
| `years_of_experience` | number | `1.5` |
| `job_designation` | string | `"Software Engineer Intern"` |
| `experience_company` | string | `"Infosys"` |
| `experience_duration` | string | `"Jun 2024 – Dec 2024"` |

**Update — multiple experiences:** students can now add **more than one**
work experience. The profile save sends an `experiences` array:
```json
"experiences": [
  { "job_designation": "SE Intern", "company": "Infosys", "duration": "Jun–Dec 2024", "years": 0.5 },
  { "job_designation": "Junior Dev", "company": "TCS", "duration": "2025", "years": 1 }
]
```
Preferred: store these in a related `student_experiences` table (one-to-many)
and return the same array on `GET /api/student/profile` and
`GET /api/client/applicants/<id>`. For backward-compatibility the frontend
also still sends the first row in the flat `job_designation` /
`experience_company` / `experience_duration` fields and a summed
`years_of_experience`, so a simple backend can ignore the array for now.

### 1.3 `GET /api/student/profile` — return `gpa_cgpa`
Confirmed working, noting here for completeness: the wizard now writes
`gpa_cgpa` (plus a legacy `gpa` alias). Please make sure the GET returns
`gpa_cgpa` so it round-trips.

---

## 2. NEW FIELDS — Company registration

### 2.1 `POST /api/client/register` — address captured at signup
Companies now enter their address during registration instead of only later
in the profile wizard. New fields in the register payload:

| Field | Type | Required |
|---|---|---|
| `address` | string | yes |
| `city` | string | yes |
| `state` | string | yes |
| `pincode` | string | optional |

These map to the **same columns** the company profile wizard already writes,
so no new columns should be needed — they just need accepting at register
time and saving. Result: the profile starts at a higher completion %.

---

## 3. DATE FORMAT (no backend change strictly required — but preferred)
Job dates currently return as full timestamps:
`"Fri, 31 Jul 2026 00:00:00 GMT"`. The frontend now strips the time and
renders only the date everywhere. **If it's easy**, returning
`last_date_to_apply` as a plain `YYYY-MM-DD` string would be cleaner for
everyone. Not blocking — frontend handles both.

---

## 4. PROFILE COMPLETION (optional, nice-to-have)
Both dashboards now show a "Your profile is X% complete" banner. The
frontend computes X by counting filled fields from the existing profile
endpoints — **no backend change needed**. If you'd rather own that number,
returning `profile_completion` (0–100) on `GET /api/student/profile` and
`GET /api/client/profile` would let us use yours instead.

---

## 5. STILL OPEN FROM v1 / v2 (reminder)
- `POST /api/student/change-password` — still pending.
- Email triggers (E1–E6 in v2 §2) — apply/shortlist/reject/job-approved etc.
- `applications_count` on `/api/admin/jobs` and `/api/client/jobs`
  (frontend currently works around this with one extra request per job).
- CORS allowlist for the deployed frontend domain.

---

## 6. NOT A BACKEND CONCERN (listed so nobody duplicates work)
These were all handled frontend-side in this batch:
skill suggestion dropdown + level dropdown (static vocabulary in the
frontend), success animations, job-detail layout alignment, admin
Reports & Analytics charts, landing-page toggle contrast, dark theme.

**Questions:** send Suher the raw response JSON for any endpoint in question.
