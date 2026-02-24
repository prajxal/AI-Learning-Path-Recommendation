import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGithubStatus, redirectToGithubConnect } from "../../services/githubApi";
import { uploadResume } from "../../services/resumeApi";
import { getUserSkills } from "../../services/userApi";
import { getToken } from "../../services/auth";
import { useProgress } from "../hooks/useProgress";

export default function DashboardPage() {
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Consolidating skills state
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Onboarding UI hooks
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);

  const { getLastAccessed } = useProgress();
  const lastAccessed = getLastAccessed();

  useEffect(() => {
    if (!token) return;

    getGithubStatus()
      .then(data => {
        setGithubConnected(data.connected);
        setGithubUsername(data.username || "");
      })
      .catch(console.error);

    getUserSkills()
      .then(data => {
        setSkills(data.skills || []);
      })
      .catch((e: any) => {
        console.error("Skill load error:", e);
        setError(e.message || "Failed to load skills");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !token) return;

    const file = e.target.files[0];
    setResumeUploading(true);

    try {
      await uploadResume(file);
      const updatedSkills = await getUserSkills();
      setSkills(updatedSkills.skills || []);
    } catch (err: any) {
      console.error(err);
      alert("Resume upload failed");
    }

    setResumeUploading(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Setup</h2>

        {/* GitHub Connect */}
        <div className="mb-4">
          {githubConnected ? (
            <div className="text-green-600 font-medium">
              ✓ Connected to GitHub as {githubUsername}
            </div>
          ) : (
            <button
              onClick={() => redirectToGithubConnect()}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Connect GitHub
            </button>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {resumeUploading && <p className="text-sm text-gray-500 mb-0 mt-2">Processing resume...</p>}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Skill Profile</h2>
        {skills.length === 0 && !loading && !error ? (
          <p className="text-gray-500">No skills detected yet.</p>
        ) : (
          <div className="space-y-3">
            {skills.map(skill => (
              <div key={skill.roadmap_id + "_profile"} className="flex justify-between items-center border-b pb-2 text-gray-700">
                <span className="capitalize font-medium text-lg text-blue-900">{skill.roadmap_id}</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">Adaptive Score: {Math.round(skill.trust_score || 0)}</span>
                  <span className="text-xs text-gray-500">Confidence: {skill.proficiency_level ? (skill.proficiency_level * 100).toFixed(0) : 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Learning Feature */}
      {lastAccessed && lastAccessed.courseId && lastAccessed.resourceId && (
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">
                {lastAccessed.courseTitle || "Active Course Module"}
              </p>
              <h3 className="text-xl font-bold">{lastAccessed.resourceTitle || "Resume where you left off"}</h3>
            </div>
            <button
              onClick={() => navigate(`/course/${lastAccessed.courseId}/resource/${lastAccessed.resourceId}`)}
              className="mt-4 sm:mt-0 bg-white text-blue-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm"
            >
              Resume ↗
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center mt-12">Learning Tracks Progress</h1>

      {/* Non-blocking loading and error states */}
      {loading && (
        <div className="grid gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-card border rounded-xl p-6 h-48 animate-pulse shadow-sm" />
          ))}
        </div>
      )}

      {error && <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-6">
          {skills.map((skill) => (
            <div
              key={skill.roadmap_id}
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold capitalize">
                  {skill.roadmap_id}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {skill.progress_percent ? skill.progress_percent.toFixed(0) : 0}%
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-600">
                    <span>Progress</span>
                    <span>
                      {skill.completed_courses || 0} / {skill.total_courses || 0} courses
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${skill.progress_percent || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Adaptive Score: {Math.round(skill.trust_score || 0)}
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
      )}
    </div>
  );
}
