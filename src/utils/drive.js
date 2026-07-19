// Google Drive helpers: turn any shared Drive/Docs link into an embeddable
// preview URL for an <iframe>. Returns null when the link isn't embeddable
// (callers then fall back to a plain "open in new tab" button).
export function driveEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    // https://drive.google.com/file/d/FILE_ID/view?...  →  /file/d/FILE_ID/preview
    let m = url.match(/drive\.google\.com\/file\/d\/([-\w]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    // https://drive.google.com/open?id=FILE_ID
    m = url.match(/drive\.google\.com\/open\?id=([-\w]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    // uc?id=FILE_ID export links
    m = url.match(/drive\.google\.com\/uc\?(?:export=\w+&)?id=([-\w]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    // Google Docs/Slides/Sheets share links → /preview
    m = url.match(/docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([-\w]+)/);
    if (m) return `https://docs.google.com/${m[1]}/d/${m[2]}/preview`;
    // Direct PDFs can be iframed as-is
    if (/\.pdf(\?.*)?$/i.test(url)) return url;
    return null;
  } catch {
    return null;
  }
}

// Normalize an applicant/student payload: some endpoints nest student fields
// under `student`, others prefix them (student_name) or use raw DB column
// names (gpa_cgpa). This flattens everything onto canonical names once.
export function normalizeApplicant(raw, pick) {
  const data = { ...(raw.student || {}), ...raw };
  data.name = pick(data, 'name', 'student_name', 'full_name') || 'Applicant';
  data.email = pick(data, 'email', 'student_email', 'contact_email');
  data.phone = pick(data, 'phone', 'contact', 'phone_number', 'mobile');
  data.institution = pick(data, 'institution', 'college', 'college_name', 'institute');
  data.department = pick(data, 'department', 'branch');
  data.gpa_cgpa = pick(data, 'gpa_cgpa', 'cgpa', 'gpa');
  data.resume_url = pick(data, 'resume_url', 'resume_link', 'resume_drive_link', 'resume', 'drive_link', 'cv_url', 'cv_link');
  data.profile_photo = pick(data, 'profile_photo', 'profile_photo_url', 'photo_url', 'avatar_url', 'image_url', 'profile_pic');
  data.cover_letter = pick(data, 'cover_letter', 'coverletter', 'cover_note');
  if (typeof data.skills === 'string') data.skills = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
  data.certificates = pick(data, 'certificates', 'certifications', 'certs') || [];
  if (typeof data.certificates === 'string') data.certificates = data.certificates.split(',').map((s) => s.trim()).filter(Boolean);
  return data;
}
