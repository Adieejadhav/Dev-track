import React from "react";
import { useFirebase } from "../Context/fireBaseContext";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebase.logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-4 px-6 rounded-b-2xl shadow-lg flex justify-between items-center">
      {/* Logo + Name */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl animate-pulse">🚀</span>
        <h1 className="text-2xl font-bold tracking-wide">DevTrack</h1>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-purple-700 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-100 transition duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default DashboardHeader;
