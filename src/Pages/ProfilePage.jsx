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

        {/* Right Profile Details */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard title="🌐 Professional Links" fields={[
            { label: 'GitHub', value: profile.githubUrl, isLink: true },
            { label: 'LinkedIn', value: profile.linkedinUrl, isLink: true },
            { label: 'Portfolio', value: profile.portfolioUrl, isLink: true },
            { label: 'Resume', value: profile.resumeUrl, isLink: true, linkText: 'View Resume' },
          ]} userId={user.uid} />

          <ProfileCard title="⚡ Skills & Achievements" fields={[
            {
              label: 'Primary Skills',
              value: Array.isArray(profile.primarySkills)
                ? profile.primarySkills.join(', ')
                : '',
            },
            { label: 'Max Coding Streak', value: profile.maxStreak },
          ]} userId={user.uid} />

          <ProfileCard title="🧠 About Me" fields={[
            { label: 'Bio', value: profile.bio }
          ]} userId={user.uid} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ title, fields, userId }) {
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleSave = async (fieldKey) => {
    if (!inputValue.trim()) return;

    const docRef = doc(db, 'users', userId);

    try {
      await updateDoc(docRef, {
        [fieldKey]: inputValue,
      });

      // Reload the page to reflect updated field
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      <div className="bg-white px-6 py-5 space-y-4">
        {fields.map((field, idx) => {
          const fieldKey = field.label
            .toLowerCase()
            .replace(/ /g, '')
            .replace('primaryskills', 'primarySkills');

          return field.value ? (
            <div key={idx} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">{field.label}</p>
              {field.isLink ? (
                <a
                  href={field.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-medium underline break-words hover:text-blue-800 transition-colors"
                >
                  {field.linkText || field.value}
                </a>
              ) : (
                <p className="text-sm text-gray-700 font-medium break-words">{field.value}</p>
              )}
            </div>
          ) : editingField === idx ? (
            <div key={idx} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">{field.label}</p>
              <input
                type="text"
                placeholder={`Enter ${field.label}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleSave(fieldKey)}
                className="text-sm mt-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              key={idx}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-all"
              onClick={() => {
                setEditingField(idx);
                setInputValue('');
              }}
            >
              <FiPlus className="text-base" />
              Add your {field.label.toLowerCase()}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ProfilePage;
