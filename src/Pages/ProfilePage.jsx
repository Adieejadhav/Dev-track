import { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';

function ProfilePage() {
  const { user } = useFirebase();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result;

        await updateDoc(doc(db, 'users', user.uid), {
          photoUrl: base64String,
        });

        setProfile((prev) => ({
          ...prev,
          photoUrl: base64String,
        }));
      };

      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  if (!user || loading) return <p className="text-center mt-10">Loading Profile...</p>;
  if (!profile) return <p className="text-center mt-10 text-red-600">Profile data not found.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">
        👋 Welcome, {profile.userName || 'Developer'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side – Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <div className="flex justify-center mb-4">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-white">
                {profile?.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <p className="text-xl font-semibold">{profile.fullName}</p>
          <p className="text-gray-600">@{profile.userName}</p>

          <label className="block mt-4 text-sm font-medium text-blue-600 cursor-pointer">
            Upload New Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Right Side – Profile Sections */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSection
            title="🎯 Basic Info"
            gradient="from-pink-500 to-orange-400"
            fields={[
              { label: 'Full Name', value: profile.fullName },
              { label: 'Username', value: profile.userName },
              { label: 'Role', value: profile.role },
              { label: 'Email', value: profile.email },
              { label: 'Location', value: profile.location },
            ]}
          />

          <ProfileSection
            title="💼 Professional Links"
            gradient="from-purple-500 to-indigo-500"
            fields={[
              { label: 'GitHub', value: profile.githubUrl, isLink: true },
              { label: 'LinkedIn', value: profile.linkedinUrl, isLink: true },
              { label: 'Portfolio', value: profile.portfolioUrl, isLink: true },
              { label: 'Resume', value: profile.resumeUrl, isLink: true, linkText: 'View Resume' },
            ]}
          />

          <ProfileSection
            title="💻 Skills & Achievements"
            gradient="from-green-500 to-lime-400"
            fields={[
              {
                label: 'Primary Skills',
                value: Array.isArray(profile.primarySkills)
                  ? profile.primarySkills.join(', ')
                  : '',
              },
              { label: 'Max Coding Streak', value: profile.maxStreak },
            ]}
          />

          <ProfileSection
            title="🧠 About Me"
            gradient="from-blue-500 to-cyan-400"
            fields={[{ label: 'Bio', value: profile.bio }]}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, gradient, fields }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full"
    >
      <h3 className={`text-xl font-semibold text-white px-4 py-2 rounded-t-md mb-4 bg-gradient-to-r ${gradient}`}>
        {title}
      </h3>

      <div className="space-y-4">
        {fields.map((field, idx) =>
          field.value ? (
            <div key={idx}>
              <p className="text-sm text-gray-500">{field.label}</p>
              {field.isLink ? (
                <a
                  href={field.value}
                  className="text-lg font-medium text-blue-600 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {field.linkText || field.value}
                </a>
              ) : (
                <p className="text-lg font-medium break-words">{field.value}</p>
              )}
            </div>
          ) : (
            <div key={idx} className="text-yellow-600 font-medium animate-pulse">
              ➕ Add your {field.label.toLowerCase()} to complete your profile!
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

export default ProfilePage;
