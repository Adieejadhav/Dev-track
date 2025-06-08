const SkillTrackerSection = ({ primarySkills }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Tracked Skills</h2>

      {primarySkills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {primarySkills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No skills found.</p>
      )}
    </div>
  );
};

export default SkillTrackerSection;
