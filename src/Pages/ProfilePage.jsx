import { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user } = useFirebase();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setProfile({ ...profileData, email: user.email });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 600, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateDoc(doc(db, 'users', user.uid), { photoUrl: base64String });
        setProfile((prev) => ({ ...prev, photoUrl: base64String }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') {
    return alert('Only PDF files allowed');
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const rawBase64 = reader.result;

    // Ensure MIME type is prefixed properly
    const dataUrl = rawBase64.startsWith('data:application/pdf')
      ? rawBase64
      : `data:application/pdf;base64,${rawBase64.split(',')[1]}`;

    try {
      await updateDoc(doc(db, 'users', user.uid), { resumeUrl: dataUrl });
      setProfile((prev) => ({ ...prev, resumeUrl: dataUrl }));
    } catch (err) {
      console.error('Resume upload failed:', err);
    }
  };

  reader.readAsDataURL(file);
};


  const handleFieldUpdate = async (field) => {
    if (!newValue.trim() || field === 'resumeUrl') return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { [field]: newValue.trim() });
      setProfile((prev) => ({ ...prev, [field]: newValue.trim() }));
    } catch (err) {
      console.error('Failed to update:', err);
    } finally {
      setEditingField(null);
      setNewValue('');
    }
  };

  if (!user || loading) return <p className="text-center mt-10">Loading Profile...</p>;
  if (!profile) return <p className="text-center mt-10 text-red-600">Profile data not found.</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-10 text-gray-800"
        >
          👋 Welcome, {profile.userName || 'Developer'}
        </motion.h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-5 border border-gray-200"
          >
            <div className="flex justify-center">
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-5xl text-white">
                  {profile?.userName?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">Profile Photo</p>

            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-800">{profile.fullName || 'No Name Provided'}</p>
              <p className="text-gray-500">@{profile.userName}</p>
              <p className="text-gray-600">{profile.role || 'No role added'}</p>
              <p className="text-gray-600">{profile.email || 'Email not available'}</p>
              <p className="text-gray-600">{profile.address || 'Address not added'}</p>
            </div>

            <label className="block mt-3 text-sm font-medium text-blue-600 cursor-pointer">
              Upload New Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </motion.div>

          {/* Right Panels */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileCard
              title="🌐 Professional Links"
              fields={[
                { label: 'GitHub', field: 'githubUrl', value: profile.githubUrl, isLink: true },
                { label: 'LinkedIn', field: 'linkedinUrl', value: profile.linkedinUrl, isLink: true },
                { label: 'Portfolio', field: 'portfolioUrl', value: profile.portfolioUrl, isLink: true },
                {
                  label: 'Resume',
                  field: 'resumeUrl',
                  value: profile.resumeUrl,
                  customElement: (
                    <div className="space-y-2">
                      {profile.resumeUrl && (
                        <button
                          onClick={() => {
                            const newWindow = window.open();
                            newWindow.document.write(`
                              <html>
                                <head><title>Resume Preview</title></head>
                                <body style="margin:0">
                                  <iframe src="${profile.resumeUrl}" frameborder="0" style="width:100%;height:100vh;"></iframe>
                                </body>
                              </html>
                            `);
                            newWindow.document.close();
                          }}
                          className="text-sm text-blue-600 underline hover:text-blue-800 font-medium block"
                        >
                          View Current Resume
                        </button>
                      )}

                      <label className="text-sm text-gray-600 underline cursor-pointer block">
                        Upload New Resume
                        <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                      </label>
                    </div>
                  ),
                }
              ]}
              editingField={editingField}
              newValue={newValue}
              onEdit={setEditingField}
              onChange={setNewValue}
              onUpdate={handleFieldUpdate}
              onCancel={() => {
                setEditingField(null);
                setNewValue('');
              }}
              />

            <ProfileCard
              title="⚡ Skills & Achievements"
              fields={[
                {
                  label: 'Primary Skills',
                  field: 'primarySkills',
                  value: Array.isArray(profile.primarySkills)
                    ? profile.primarySkills.join(', ')
                    : '',
                },
                { label: 'Max Coding Streak', field: 'maxStreak', value: profile.maxStreak },
              ]}
              editingField={editingField}
              newValue={newValue}
              onEdit={setEditingField}
              onChange={setNewValue}
              onUpdate={handleFieldUpdate}
              onCancel={() => {
                setEditingField(null);
                setNewValue('');
              }}
            />

            <ProfileCard
              title="🧠 About Me"
              fields={[{ label: 'Bio', field: 'bio', value: profile.bio }]}
              editingField={editingField}
              newValue={newValue}
              onEdit={setEditingField}
              onChange={setNewValue}
              onUpdate={handleFieldUpdate}
              onCancel={() => {
                setEditingField(null);
                setNewValue('');
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileCard({ title, fields, editingField, newValue, onEdit, onChange, onUpdate, onCancel }) {
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
            const isEditing = editingField === field.field;

            // Special handling for resume
            if (field.field === 'resumeUrl') {
              return (
                <div key={idx} className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-400">{field.label}</p>
                  {field.customElement}
                </div>
              );
            }

            // Normal field rendering
            return field.value ? (
              <div key={idx} className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-400">{field.label}</p>
                {field.customElement ? (
                  field.customElement
                ) : field.isLink ? (
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
            ) : isEditing ? (
              <div key={idx} className="space-y-2">
                <input
                  value={newValue}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(field.field)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                key={idx}
                onClick={() => onEdit(field.field)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-all"
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

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-gray-800">DevTrack</h1>
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
      </div>
    </nav>
  );
}

export default ProfilePage;
