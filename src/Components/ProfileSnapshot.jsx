import { FaGithub, FaUserTie } from "react-icons/fa";

const ProfileSnapshot = ({ userData }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">
        Welcome, {userData.userName} 👋
      </h2>

      <div className="flex items-center text-gray-600 gap-2 mb-2">
        <FaUserTie />
        <span>{userData.role}</span>
      </div>

      {userData.githubUrl && (
        <div className="flex items-center text-blue-600 gap-2 mb-4">
          <FaGithub />
          <a
            href={userData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline break-all"
          >
            {userData.githubUrl}
          </a>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Primary Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {userData.primarySkills?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-slate-200 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSnapshot;
