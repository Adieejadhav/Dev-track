// src/Pages/Dashboard.jsx
import React from 'react';
import { useFirebase } from '../Context/fireBaseContext';

function Dashboard() {
  const firebase = useFirebase();
  const currentUser = firebase.user;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ''} 👋
        </h1>

        <p className="text-gray-600 mb-6">Here’s your progress overview:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">🎯 Goals</h2>
            <p className="text-sm text-gray-700">Track and manage your development goals.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-green-700 mb-2">📈 Recent Progress</h2>
            <p className="text-sm text-gray-700">Log your daily/weekly accomplishments.</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">📄 Resume Builder</h2>
            <p className="text-sm text-gray-700">Keep your resume up to date as you grow.</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">🙋 Profile Snapshot</h2>
            <p className="text-sm text-gray-700">View and manage your profile details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
