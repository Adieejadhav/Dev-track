// components/ProfileSnapshot.jsx
import { useEffect, useState } from "react";
import { db } from "../Firebase/fireBaseConfig";
import { FaGithub, FaUserTie } from "react-icons/fa";
import { useFirebase } from "../Context/fireBaseContext";
import { doc, getDoc } from "firebase/firestore";

const ProfileSnapshot = () => {
  const { user} = useFirebase();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.uid) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, db]);

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto text-center">
        Loading profile...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto text-center">
        Profile data not found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">
        Welcome, {profileData.userName} 👋
      </h2>

      <div className="flex items-center text-gray-600 gap-2 mb-2">
        <FaUserTie />
        <span>{profileData.role}</span>
      </div>

      {profileData.githubUrl && (
        <div className="flex items-center text-blue-600 gap-2 mb-4">
          <FaGithub />
          <a
            href={profileData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline break-all"
          >
            {profileData.githubUrl}
          </a>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Primary Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.primarySkills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-slate-200 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSnapshot;
