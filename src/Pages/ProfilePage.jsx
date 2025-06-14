import { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

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
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10 text-gray-800"
      >
        👋 Welcome, {profile.userName || 'Developer'}
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Profile Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-5 border border-gray-200"
        >
          <div className="flex justify-center">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-5xl text-white">
                {profile?.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-800">{profile.fullName || 'No Name Provided'}</p>
            <p className="text-gray-500">@{profile.userName}</p>
            <p className="text-gray-600">{profile.role || 'No role added'}</p>
            <p className="text-gray-600">{profile.email || 'Email not added'}</p>
            <p className="text-gray-600">{profile.location || 'Location not added'}</p>
          </div>

          <label className="block mt-3 text-sm font-medium text-blue-600 cursor-pointer">
            Upload New Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Profile Details */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard title="🌐 Professional Links" fields={[
            { label: 'GitHub', value: profile.githubUrl, isLink: true },
            { label: 'LinkedIn', value: profile.linkedinUrl, isLink: true },
            { label: 'Portfolio', value: profile.portfolioUrl, isLink: true },
            { label: 'Resume', value: profile.resumeUrl, isLink: true, linkText: 'View Resume' },
          ]} />

          <ProfileCard title="⚡ Skills & Achievements" fields={[
            {
              label: 'Primary Skills',
              value: Array.isArray(profile.primarySkills)
                ? profile.primarySkills.join(', ')
                : '',
            },
            { label: 'Max Coding Streak', value: profile.maxStreak },
          ]} />

          <ProfileCard title="🧠 About Me" fields={[
            { label: 'Bio', value: profile.bio }
          ]} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ title, fields }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {fields.map((field, idx) =>
          field.value ? (
            <div key={idx}>
              <p className="text-sm text-gray-500">{field.label}</p>
              {field.isLink ? (
                <a
                  href={field.value}
                  className="text-base text-blue-600 font-medium underline break-words"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {field.linkText || field.value}
                </a>
              ) : (
                <p className="text-base text-gray-800 break-words">{field.value}</p>
              )}
            </div>
          ) : (
            <button
              key={idx}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
            >
              <FiPlus className="text-base" />
              Add your {field.label.toLowerCase()}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}

export default ProfilePage;
