// pages/Dashboard.jsx
import React from "react";
import ProfileSnapshot from "../Components/ProfileSnapshot";
// (SkillTrackerSection will be added soon)

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">DevTrack Dashboard</h1>

      <div className="flex flex-col gap-6 items-center">
        <ProfileSnapshot/>


      </div>
    </div>
  );
};

export default Dashboard;
