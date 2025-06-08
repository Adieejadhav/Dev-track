// components/ProfileSnapshot.jsx
import { FaGithub, FaUserTie } from "react-icons/fa";

const ProfileSnapshot = () => {
    const user = {
  username: "Adiee Jadhav",
  role: "Frontend Developer",
  github: "https://github.com/Adieejadhav",
  primarySkills: ["React", "Firebase", "Tailwind", "JavaScript"]
};

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome, {user.username} 👋</h2>
      
      <div className="flex items-center text-gray-600 gap-2 mb-2">
        <FaUserTie />
        <span>{user.role}</span>
      </div>
      
      <div className="flex items-center text-blue-600 gap-2 mb-4">
        <FaGithub />
        <a
          href={user.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {user.github}
        </a>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Primary Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {user.primarySkills.map((skill, idx) => (
            <span key={idx} className="bg-slate-200 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSnapshot;
