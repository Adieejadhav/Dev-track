// pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext'; // Adjust if path is different
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';

function ProfilePage() {
  const { user } = useFirebase(); // Authenticated user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; // 🔐 Wait for user to be available

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

  // Show loading until both auth + data are ready
  if (!user || loading) {
    return <p className="text-center mt-10">Loading Profile...</p>;
  }

  // If user doc is missing (shouldn't happen unless deleted)
  if (!profile) {
    return <p className="text-center mt-10 text-red-600">Profile data not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">👤 My Profile</h2>

      <div className="space-y-4">
        <ProfileField label="Name" value={profile.fullName} />
        <ProfileField label="Username" value={profile.userName} />
        <ProfileField label="Role" value={profile.role} />
        <ProfileField
          label="GitHub Link"
          value={
            <a
              href={profile.githubUrl}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.githubUrl}
            </a>
          }
        />
        <ProfileField
          label="Primary Skills"
          value={Array.isArray(profile.primarySkills) ? profile.primarySkills.join(', ') : ''}
        />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}

export default ProfilePage;
