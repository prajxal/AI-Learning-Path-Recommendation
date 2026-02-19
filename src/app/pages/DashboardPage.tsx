import React from "react";
import { Link } from "react-router-dom";
import { useUserSkills } from "../../hooks/useUserSkills";

export default function DashboardPage() {
  const userId = localStorage.getItem("user_id") || "1";
  const { skills, loading, error } = useUserSkills(userId);

  if (loading) return <div className="p-8 text-center">Loading skills...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Skills</h1>

      <div className="grid gap-6">
        {skills.map((skill) => (
          <div
            key={skill.roadmap_id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {skill.roadmap_id}
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {skill.progress_percent.toFixed(0)}%
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 text-gray-600">
                  <span>Progress</span>
                  <span>
                    {skill.completed_courses} / {skill.total_courses} courses
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${skill.progress_percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm font-medium text-gray-700">
                  Skill Level: {Math.round(skill.trust_score)}
                </div>

                <Link
                  to={`/roadmaps/${skill.roadmap_id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed">
            You haven't started any learning paths yet.
            <br />
            <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Browse Roadmaps
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
