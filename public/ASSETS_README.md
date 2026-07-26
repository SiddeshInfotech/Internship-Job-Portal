# Placify — Assets Checklist

Drop files into these exact paths under `public/`. Everything already has a
safe fallback (gradient / initials / plain text), so the site works fine
without any of these — but it'll look noticeably more premium once they're in.

## ✅ Done
- **Logo** — `public/images/brand/placify-icon.png` (icon mark, used in Navbar + Footer) and `public/images/brand/placify-full-logo.png` (full lockup with wordmark, unused for now — available if you want it somewhere else)

## ⬜ Still to add

### 1. Hero background video
| Path | Used on | Notes |
|---|---|---|
| `public/videos/hero-bg.mp4` | Home page hero | Landscape, 10-20s loop, no audio needed (muted). Keep under ~8MB for fast load — compress with Handbrake/ffmpeg if larger. 1920x1080 or 1280x720 is plenty. |
| `public/images/hero-poster.jpg` | Home page hero | Single frame shown before the video loads. Same aspect ratio as the video. |

If this file is missing, the hero silently falls back to the current
animated gradient — nothing breaks either way.

### 2. Company logos
| Path | Used on |
|---|---|
| `public/images/companies/{slug}.png` | Trusted Companies marquee (Home) + every Job Card logo |

`{slug}` = the company name, lowercased, spaces/punctuation replaced with
hyphens. For the current dummy data you'd need:

```
public/images/companies/google.png
public/images/companies/infosys.png
public/images/companies/tcs.png
public/images/companies/wipro.png
public/images/companies/microsoft.png
public/images/companies/amazon.png
public/images/companies/ibm.png
public/images/companies/accenture.png
public/images/companies/technova-solutions.png
public/images/companies/stellar-cloud-systems.png
public/images/companies/insight-analytics.png
public/images/companies/global-brands-inc.png
public/images/companies/creative-pulse.png
public/images/companies/north-star-logistics.png
```

Format: transparent-background PNG, roughly square (e.g. 200x200px), logo
centered with a little padding. If a file is missing for a given company,
that card just falls back to a colored initial-letter badge — no broken
image icons.

**Important:** only use logos you have the rights to use (your own client
companies' actual marks, or ones they've given permission for) — don't pull
official Google/Microsoft/etc. logo files directly, since those are
trademarked. Swap the dummy `trustedCompanies` list in
`src/utils/landingData.js` for real partner companies once you have their
logos.

### 3. Team photos (About page)
| Path | Used on |
|---|---|
| `public/images/team/{slug}.jpg` | Meet the Team section |

Same slug rule as above, based on the names in `src/pages/landing/About.jsx`
(`TEAM` array). Square headshots, at least 200x200px, work best. Missing
photos fall back to an initial-letter avatar automatically.

### 4. Testimonial avatars (optional — not wired yet)
Currently testimonials on the Home page show text only (name + role, no
photo). If you want avatar photos there too, let me know and I'll wire
`public/images/testimonials/{slug}.jpg` the same way as the others.

---

### How the fallback pattern works (for reference)
Every image above uses an `onError` handler that swaps to a safe fallback
the moment the browser fails to load the file — so you can deploy today
with zero images uploaded, and drop them in later without touching any code.

