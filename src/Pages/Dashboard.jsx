// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useFirebase } from '../Context/fireBaseContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/fireBaseConfig';

function Dashboard() {
  const firebase = useFirebase();
  const currentUser = firebase.user;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No such user data found');
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={userData?.photoURL || 'https://i.pravatar.cc/100'}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome{userData?.fullName ? `, ${userData.fullName}` : ''} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {userData?.primarySkills
                ? `Primary Skills: ${userData.primarySkills}`
                : 'Loading your skills...'}
            </p>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">🎯 Goals</h2>
            <p className="text-sm text-gray-700">Track and manage your development goals.</p>
          </div>

          <div className="bg-green-50 p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-green-700 mb-2">📈 Recent Progress</h2>
            <p className="text-sm text-gray-700">Log your daily/weekly accomplishments.</p>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">📄 Resume Builder</h2>
            <p className="text-sm text-gray-700">Keep your resume up to date as you grow.</p>
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-yellow-700 mb-4">🙋 Profile Snapshot</h2>
            <div className="text-gray-800 text-sm space-y-2 leading-relaxed">
              <p><span className="font-medium">👤 Username:</span> {userData?.userName || 'N/A'}</p>
              <p><span className="font-medium">📧 Email:</span> {currentUser?.email || 'N/A'}</p>
              <p><span className="font-medium">🛡️ Role:</span> {userData?.role || 'N/A'}</p>
              {userData?.githubUrl && (
                <p>
                  <span className="font-medium">💻 GitHub:</span>{' '}
                  <a
                    href={userData.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {userData.githubUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
