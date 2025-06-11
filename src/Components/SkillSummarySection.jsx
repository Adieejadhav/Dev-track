import React from "react";

const SkillSummarySection = ({ trackedProgress, initialTrackedProgress, trackingStartedAt }) => {
  if (!trackedProgress || !initialTrackedProgress) return null;

  const summary = Object.keys(trackedProgress).map((skill) => {
    const initial = initialTrackedProgress[skill] || 0;
    const current = trackedProgress[skill];
    return {
      skill,
      diff: current - initial,
    };
  });

  const totalGain = summary.reduce((acc, item) => acc + item.diff, 0);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6 max-w-4xl mx-auto mt-12 transition-shadow hover:shadow-2xl">
      <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">
        📈 Progress Summary
      </h2>

      <ul className="space-y-3 text-lg text-gray-800 font-medium">
        {summary.map(({ skill, diff }) => (
          <li key={skill}>
            {skill}: <span className="text-green-600 font-semibold">+{diff}%</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center text-indigo-600 font-semibold">
        Total Gain: <span className="text-indigo-800">+{totalGain}%</span>
      </div>

      {trackingStartedAt && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Tracking since: {formatDate(trackingStartedAt)}
        </div>
      )}
    </section>
  );
};

export default SkillSummarySection;
