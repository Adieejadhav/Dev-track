import { FaGithub, FaUserTie } from "react-icons/fa";

const ProfileSnapshot = ({ userData }) => {
  return (
    <div className="bg-gradient-to-tr from-indigo-50 to-purple-100 shadow-2xl rounded-3xl p-8 w-full max-w-xl mx-auto border border-indigo-200">
      <h2 className="text-3xl font-extrabold text-indigo-900 mb-4">
        Welcome, <span className="text-purple-700">{userData.userName}</span> 👋
      </h2>

      <div className="flex items-center text-indigo-700 gap-3 mb-4 text-lg font-medium">
        <FaUserTie className="text-purple-600" />
        <span>{userData.role}</span>
      </div>

      {userData.githubUrl && (
        <div className="flex items-center text-indigo-600 gap-3 mb-6">
          <FaGithub className="text-gray-800 hover:text-purple-700 transition-colors duration-300" />
          <a
            href={userData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline break-words font-semibold"
          >
            {userData.githubUrl}
          </a>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-indigo-800 mb-3 text-lg">Primary Skills:</h3>
        <div className="flex flex-wrap gap-3">
          {userData.primarySkills?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-purple-200 text-purple-900 px-4 py-1 rounded-full text-sm font-semibold shadow-sm select-none"
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
