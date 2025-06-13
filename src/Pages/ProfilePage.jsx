import { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';
import { motion } from 'framer-motion';

function ProfilePage() {
  const { user } = useFirebase();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          if (data.photoUrl) setImageUrl(data.photoUrl);
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
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { photoUrl: base64 });
        setImageUrl(base64);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
    }
  };

  if (!user || loading)
    return <p className="text-center mt-10">Loading Profile...</p>;

  if (!profile)
    return (
      <p className="text-center mt-10 text-red-600">
        Profile data not found.
      </p>
    );

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Left Column */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow">
            {profile.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}

        <label className="text-sm text-indigo-600 cursor-pointer hover:underline">
          {uploading ? 'Uploading...' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="text-center mt-2">
          <h2 className="text-xl font-bold">{profile.userName || 'Username'}</h2>
          <p className="text-gray-600">{profile.role || 'Role not set'}</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {
              label: 'GitHub',
              value: profile.githubUrl,
              isLink: true,
            },
            {
              label: 'LinkedIn',
              value: profile.linkedinUrl,
              isLink: true,
            },
            {
              label: 'Portfolio',
              value: profile.portfolioUrl,
              isLink: true,
            },
            {
              label: 'Resume',
              value: profile.resumeUrl,
              isLink: true,
              linkText: 'View Resume',
            },
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
            {
              label: 'Max Coding Streak',
              value: profile.maxStreak,
            },
          ]}
        />
        <ProfileSection
          title="🧠 About Me"
          gradient="from-blue-500 to-cyan-400"
          fields={[{ label: 'Bio', value: profile.bio }]}
        />
      </div>
    </motion.div>
  );
}

function ProfileSection({ title, gradient, fields }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3
        className={`text-lg font-semibold text-white px-4 py-2 rounded-t-md mb-4 bg-gradient-to-r ${gradient}`}
      >
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
            <div
              key={idx}
              className="text-yellow-600 font-medium animate-pulse"
            >
              ➕ Add your {field.label.toLowerCase()} to complete your profile!
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

export default ProfilePage;
