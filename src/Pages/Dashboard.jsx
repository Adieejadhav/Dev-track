import React, { useEffect, useState } from "react";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import SkillTrackerSection from "../Components/SkillTrackerSection";
import { useFirebase } from "../Context/fireBaseContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/fireBaseConfig";

const Dashboard = () => {
  const firebase = useFirebase();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const userRef = doc(db, "users", firebase.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    if (firebase.user?.uid) {
      fetchProfile();
    }
  }, [firebase.user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">DevTrack Dashboard</h1>

      <div className="flex flex-col gap-6 items-center">
        <ProfileSnapshot userData={userData} />
        <SkillTrackerSection
  key={JSON.stringify(userData.trackedSkills)} // 🔥 This forces re-render
  primarySkills={userData.primarySkills || []}
  trackedSkills={userData.trackedSkills || []}
  onUpdate={fetchProfile}
/>



      </div>
    </div>
  );
};

export default Dashboard;
