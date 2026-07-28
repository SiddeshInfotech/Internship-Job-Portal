import React, { useState, useEffect } from 'react';
import studentAxios from '../../api/studentAxios'; // Adjust this path if needed
import { FiUpload, FiUser } from 'react-icons/fi';

function StudentSettings() {
  const [profile, setProfile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch the student's current profile when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAxios.get('/student/profile');
        const data = res.data.profile || res.data;
        setProfile(data);
        setPhotoUrl(data.profile_photo || data.profile_photo_url || data.photo_url || '');
      } catch (error) {
        console.error("Failed to fetch profile settings", error);
      }
    };
    fetchProfile();
  }, []);

  // Fake Cloudinary upload function (Replace with your actual upload logic)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_CLOUDINARY_PRESET'); // Update this
    
    const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handlePhotoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Upload the image to Cloudinary
      const newPhotoUrl = await uploadToCloudinary(file);
      
      // 2. Save the new URL to your backend database
      await studentAxios.post('/student/profile/photo', { photo_url: newPhotoUrl });
      
      // 3. Update the local state so the image changes on the Settings page
      setPhotoUrl(newPhotoUrl);
      
      // 4. ✨ DISPATCH EVENT ✨ - This tells the Navbar to refresh the photo instantly!
      window.dispatchEvent(new Event('profileUpdated'));
      
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Failed to update profile photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Account Settings</h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Profile Photo</h2>
        
        <div className="flex items-center gap-6">
          {/* Photo Preview Circle */}
          <div className="relative w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FiUser size={40} className="text-blue-500" />
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-bold">Uploading...</span>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Upload a new avatar. Larger images will be resized automatically. <br/> Maximum upload size is 2MB.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <FiUpload size={16} />
              {isUploading ? 'Uploading...' : 'Upload Photo'}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoFile}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentSettings;