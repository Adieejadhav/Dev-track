import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFirebase } from "../Context/fireBaseContext";

const Homepage = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const features = [
    {
      icon: "👤",
      title: "Developer Profile",
      desc: "Create a personalized profile with your bio, GitHub, and skills.",
    },
    {
      icon: "📌",
      title: "Tracked Skills",
      desc: "Track your ongoing learning and showcase consistency.",
    },
    {
      icon: "🗓️",
      title: "Daily Logs",
      desc: "Record your learning activities daily.",
    },
    {
      icon: "📊",
      title: "Visual Progress",
      desc: "See real-time progress with charts and streaks.",
    },
    {
      icon: "🔗",
      title: "Shareable Profile",
      desc: "Get a public URL to share with recruiters.",
    },
    {
      icon: "⚙️",
      title: "Easy Management",
      desc: "Customize your learning dashboard anytime.",
    },
  ];

  return (
    <div className="text-gray-800 font-sans bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm px-6 py-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-indigo-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          DevTrack
        </h1>

        <nav className="text-sm font-semibold flex items-center gap-4 relative">
          {!user ? (
            <>
              <Link
                to="/signupuser"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-indigo-800 animate-pulse mb-4">
            Track. Grow. Shine.
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-700">
            DevTrack helps you document your journey, improve daily, and show
            your evolution as a developer.
          </p>
          {!user && (
            <Link
              to="/signupuser"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-lg"
            >
              Get Started
            </Link>
          )}
        </motion.div>

        {/* Animated Blobs */}
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-purple-300 rounded-full opacity-30 animate-blob1"></div>
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-pink-300 rounded-full opacity-30 animate-blob2"></div>
      </section>

      {/* Why DevTrack */}
      <motion.section
        className="py-16 px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Why DevTrack?</h2>
        <p className="max-w-xl mx-auto text-lg text-gray-700">
          Whether you're a student or professional, DevTrack brings your
          developer growth to life with elegant tools and insightful features.
        </p>
      </motion.section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-indigo-800">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="bg-gradient-to-tr from-white via-gray-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <motion.section
        className="py-16 px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <ol className="text-left max-w-2xl mx-auto space-y-4 text-lg list-decimal pl-6 text-gray-700">
          <li>Sign up and create your profile.</li>
          <li>Add your primary skills and start tracking new ones.</li>
          <li>Log your daily progress and view growth stats.</li>
          <li>Share your profile with recruiters using a public link.</li>
        </ol>
      </motion.section>

      {/* For Recruiters */}
      <motion.section
        className="bg-indigo-50 py-16 px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">
          For Recruiters
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Access genuine developer growth, view their real-time progress and
          skill snapshots. Go beyond the resume.
        </p>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 px-8 text-center bg-indigo-700 text-white">
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="mb-6 text-lg">
            Build your profile. Track your progress. Get noticed.
          </p>
          {!user && (
            <Link
              to="/signupuser"
              className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 shadow-lg transition"
            >
              Sign Up Now
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;
