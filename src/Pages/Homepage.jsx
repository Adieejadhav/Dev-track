import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">DevTrack</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Track your developer journey, showcase your skills, and grow every day.
        </p>
        <Link
          to="/register"
          className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Why DevTrack */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Why DevTrack?</h2>
        <p className="max-w-xl mx-auto text-lg">
          Whether you're learning to code or preparing for jobs, DevTrack helps you
          document your growth, build a portfolio, and impress recruiters — all in one place.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FeatureCard title="👤 Developer Profile" desc="Create a personalized profile with your bio, links, GitHub, and primary skills." />
          <FeatureCard title="📌 Tracked Skills" desc="Select skills you're improving and track progress with just a few clicks." />
          <FeatureCard title="🗓️ Daily Logs" desc="Add daily notes for skill practice and keep a record of your growth." />
          <FeatureCard title="📊 Visual Progress" desc="See how far you've come with progress bars and skill stats." />
          <FeatureCard title="🔗 Shareable Profile" desc="Get a public link to showcase your journey to recruiters and peers." />
          <FeatureCard title="⚙️ Easy Management" desc="Promote skills, reset progress, and customize your learning dashboard." />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <ol className="text-left max-w-2xl mx-auto space-y-4 text-lg list-decimal pl-6">
          <li>Sign up and create your profile.</li>
          <li>Add your primary skills and start tracking new ones.</li>
          <li>Log your daily progress and view growth stats.</li>
          <li>Share your profile with recruiters using a public link.</li>
        </ol>
      </section>

      {/* For Recruiters */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">For Recruiters</h2>
        <p className="max-w-2xl mx-auto text-lg">
          View developers’ real-time progress, primary skillsets, and growth history. 
          Get an authentic snapshot of their journey — not just a resume.
        </p>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-8 text-center bg-indigo-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Start tracking your journey today</h2>
        <p className="mb-6 text-lg">Build your profile. Track your skills. Get noticed.</p>
        <Link
          to="/register"
          className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 shadow-lg transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Homepage;
