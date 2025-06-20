import React, { useEffect, useState } from "react";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import DashboardHeader from "../Components/DashboardHeader";
import SkillSummarySection from "../Components/SkillSummarySection.jsx";
import SkillTrackerSection from "../Components/SkillTrackerSection.jsx";
import TrackedSkillsSection from "../Components/TrackedSkillsSection.jsx";
import DailyProgressSection from "../Components/DailyProgressSection.jsx";
import { useFirebase } from "../Context/fireBaseContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/fireBaseConfig";
// import { useNavigate } from "react-router-dom"; // Optional for redirect

const Dashboard = () => {
  const firebase = useFirebase();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); // Optional for redirect

  const fetchProfile = async () => {
    if (!firebase?.user?.uid) return;
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
    if (firebase?.user?.uid) {
      fetchProfile();
    } else {
      setUserData(null);
      setLoading(false);
      // navigate("/login"); // Optional: Redirect to login on logout
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
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-8 lg:px-20">
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

          {/* Profile Snapshot */}
          <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto transition-shadow hover:shadow-2xl">
            <h2 className="text-3xl font-semibold text-indigo-800 mb-6 text-center">
              👤 Profile Overview
            </h2>
            <ProfileSnapshot userData={userData} />
          </section>

          {/* Skill Tracker */}
          <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto transition-shadow hover:shadow-2xl">
            <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">
              🛠️ Skill Tracker
            </h2>
            {firebase?.user?.uid && (
              <SkillTrackerSection
                key={firebase.user.uid}
                primarySkills={userData?.primarySkills || []}
                trackedSkills={userData?.trackedSkills || []}
                onUpdate={fetchProfile}
              />
            )}
          </section>


          
          <SkillSummarySection
            trackedProgress={userData?.trackedProgress || {}}
            initialTrackedProgress={userData?.initialTrackedProgress || {}}
            trackingStartedAt={userData?.trackingStartedAt}
          />




          {/* Tracked Skills Progress */}
          <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto transition-shadow hover:shadow-2xl">
            <h2 className="text-3xl font-semibold text-cyan-700 mb-6 text-center">
              📊 Tracked Skills Progress
            </h2>
            {firebase?.user?.uid && (
              <TrackedSkillsSection
                trackedSkills={userData?.trackedSkills || []}
              />
            )}
          </section>

          {/* Daily Progress */}
          <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto transition-shadow hover:shadow-2xl">
            <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
              📅 Daily Progress Log
            </h2>
            <DailyProgressSection />
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
