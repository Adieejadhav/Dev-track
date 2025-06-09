import React, { useEffect, useState } from "react";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import SkillTrackerSection from "../Components/SkillTrackerSection.jsx";
import DailyProgressSection from "../Components/DailyProgressSection.jsx";
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
      <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center text-xl font-semibold text-indigo-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-3">
            🚀 DevTrack Dashboard
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Your journey, skills, and progress — all in one beautiful place.
          </p>
        </header>

        {/* Profile Snapshot Section */}
        <section className="bg-white/90 backdrop-blur-md border border-indigo-200 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-6 text-center">
            👤 Profile Overview
          </h2>
          <ProfileSnapshot userData={userData} />
        </section>

        {/* Skill Tracker Section */}
        <section className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">
            🛠️ Skill Tracker
          </h2>
          <SkillTrackerSection
            key={JSON.stringify(userData.trackedSkills)}
            primarySkills={userData.primarySkills || []}
            trackedSkills={userData.trackedSkills || []}
            onUpdate={fetchProfile}
          />
        </section>

        {/* Daily Progress Section */}
        <section className="bg-white/90 backdrop-blur-md border border-blue-200 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
            📅 Daily Progress Log
          </h2>
          <DailyProgressSection />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
