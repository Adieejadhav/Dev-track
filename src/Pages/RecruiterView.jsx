import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';

function RecruiterView() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicProfile = async () => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (err) {
      console.error('Error fetching recruiter view profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProfile();
  }, [uid]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center text-red-500 mt-10">Profile not found</p>;

  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-100 rounded-xl p-6 shadow-md">
        <div className="flex flex-col items-center text-center">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} className="w-28 h-28 rounded-full object-cover mb-4" alt="Profile" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-white mb-4">
              {profile.userName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold">{profile.fullName || 'Anonymous'}</h2>
          <p className="text-gray-600">@{profile.userName}</p>
          <p className="mt-2">{profile.role || 'No role defined'}</p>
        </div>

        <div className="mt-6 space-y-4">
          <section>
            <h3 className="font-semibold mb-1">Bio</h3>
            <p>{profile.bio || 'No bio available'}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">Primary Skills</h3>
            <p>{Array.isArray(profile.primarySkills) ? profile.primarySkills.join(', ') : 'No skills listed'}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">Links</h3>
            <ul className="list-disc list-inside">
              {profile.githubUrl && <li><a href={profile.githubUrl} target="_blank" className="text-blue-600 underline">GitHub</a></li>}
              {profile.linkedinUrl && <li><a href={profile.linkedinUrl} target="_blank" className="text-blue-600 underline">LinkedIn</a></li>}
              {profile.portfolioUrl&& <li><a href={profile.portfolioUrl} target="_blank" className="text-blue-600 underline">Portfolio</a></li>}
              {profile.resumeUrl && <li><a href={profile.resumeUrl} target="_blank" className="text-blue-600 underline">Resume</a></li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RecruiterView;

