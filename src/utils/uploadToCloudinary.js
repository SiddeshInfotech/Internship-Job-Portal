// Direct browser → Cloudinary upload for STUDENT PROFILE PHOTOS ONLY.
// (Resumes stay on Google Drive links — the backend validates those
// separately, so never route resumes through here.)
// Uses the unsigned preset, so no API secret ever touches the frontend.
export async function uploadToCloudinary(file) {
  // Client-side guards matching the preset's recommended restrictions
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, or WEBP).');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image is too large — please keep it under 5MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Photo upload failed. Please try again.');
  }

  const data = await response.json();
  return data.secure_url;
}
